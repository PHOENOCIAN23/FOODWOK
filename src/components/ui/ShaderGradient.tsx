'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface ShaderGradientProps {
  color1?: string;
  color2?: string;
  color3?: string;
  uSpeed?: number;
  uStrength?: number;
  uDensity?: number;
  uFrequency?: number;
  brightness?: number;
  className?: string;
  interactive?: boolean;
}

// Convert Hex string (#RRGGBB) to normalized RGB [r, g, b] float tuple
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return [r, g, b];
}

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  varying vec2 v_uv;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_strength;
  uniform float u_density;
  uniform float u_frequency;
  uniform float u_brightness;

  // Simplex-inspired 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 pos = vec2(uv.x * aspect, uv.y) * u_density;

    float t = u_time * u_speed * 0.4;

    // Multi-octave wave displacement
    float n1 = snoise(pos * u_frequency * 0.25 + vec2(t * 0.7, -t * 0.5));
    float n2 = snoise(pos * u_frequency * 0.5 - vec2(t * 0.4, t * 0.8) + vec2(n1 * u_strength * 0.3));
    float n3 = snoise(pos * u_frequency * 0.8 + vec2(t * 0.5, t * 0.3) + vec2(n2 * u_strength * 0.4));

    // Mouse influence
    vec2 mouseUv = u_mouse / u_resolution;
    float distToMouse = length(v_uv - mouseUv);
    float mouseWave = exp(-distToMouse * 3.5) * sin(distToMouse * 20.0 - t * 4.0) * 0.15;

    float waveMix = clamp((n1 + n2 * 0.7 + n3 * 0.4 + mouseWave) * 0.5 + 0.5, 0.0, 1.0);

    // Three-stop gradient blend
    vec3 color;
    if (waveMix < 0.5) {
      float factor = smoothstep(0.0, 0.5, waveMix);
      color = mix(u_color1, u_color2, factor);
    } else {
      float factor = smoothstep(0.5, 1.0, waveMix);
      color = mix(u_color2, u_color3, factor);
    }

    // Specular wok sheen highlight
    float specular = pow(clamp(n2 * 0.6 + 0.5, 0.0, 1.0), 4.0) * 0.25;
    color += vec3(specular) * u_color2;

    color *= u_brightness;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const ShaderGradient: React.FC<ShaderGradientProps> = ({
  color1 = '#EB3223', // Foodwok Vermilion Red
  color2 = '#F59E0B', // Turmeric Saffron Amber
  color3 = '#1E1B4B', // Deep Smoky Charcoal / Aubergine
  uSpeed = 0.35,
  uStrength = 1.6,
  uDensity = 1.4,
  uFrequency = 4.8,
  brightness = 1.05,
  className = '',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      powerPreference: 'high-performance',
      alpha: false,
      antialias: true,
    });

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    // Helper: compile shader
    function compileShader(type: number, source: string): WebGLShader | null {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

    if (!vs || !fs) {
      setWebglSupported(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(program));
      setWebglSupported(false);
      return;
    }

    gl.useProgram(program);

    // Fullscreen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uColor1 = gl.getUniformLocation(program, 'u_color1');
    const uColor2 = gl.getUniformLocation(program, 'u_color2');
    const uColor3 = gl.getUniformLocation(program, 'u_color3');
    const uSpeedLoc = gl.getUniformLocation(program, 'u_speed');
    const uStrengthLoc = gl.getUniformLocation(program, 'u_strength');
    const uDensityLoc = gl.getUniformLocation(program, 'u_density');
    const uFreqLoc = gl.getUniformLocation(program, 'u_frequency');
    const uBrightLoc = gl.getUniformLocation(program, 'u_brightness');

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = rect.height - (e.clientY - rect.top);
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    let animationFrameId: number;
    const startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = (now: number) => {
      resize();
      const elapsed = (now - startTime) * 0.001;

      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);
      const rgb3 = hexToRgb(color3);

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform3f(uColor1, rgb1[0], rgb1[1], rgb1[2]);
      gl.uniform3f(uColor2, rgb2[0], rgb2[1], rgb2[2]);
      gl.uniform3f(uColor3, rgb3[0], rgb3[1], rgb3[2]);
      gl.uniform1f(uSpeedLoc, uSpeed);
      gl.uniform1f(uStrengthLoc, uStrength);
      gl.uniform1f(uDensityLoc, uDensity);
      gl.uniform1f(uFreqLoc, uFrequency);
      gl.uniform1f(uBrightLoc, brightness);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, [color1, color2, color3, uSpeed, uStrength, uDensity, uFrequency, brightness, interactive]);

  if (!webglSupported) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-tr from-[#EB3223] via-[#F59E0B] to-[#1E1B4B] animate-pulse opacity-90 ${className}`}
        style={{ pointerEvents: 'none' }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ display: 'block' }}
    />
  );
};
