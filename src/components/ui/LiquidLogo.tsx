'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface LiquidLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'crimson-chrome' | 'molten-gold';
  className?: string;
  showText?: boolean;
}

const SIZE_MAP = {
  sm: { box: 34, text: 'text-xl', badge: 'px-2 py-1 text-sm' },
  md: { box: 42, text: 'text-2xl', badge: 'px-2.5 py-1 text-base' },
  lg: { box: 56, text: 'text-3xl', badge: 'px-3.5 py-1.5 text-lg' },
  xl: { box: 72, text: 'text-4xl', badge: 'px-4 py-2 text-2xl' },
};

const VS_SOURCE = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_pos + 1.0) * 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

// Liquid metal fragment shader with edge detection & fluid flow
const FS_SOURCE = `
  precision highp float;
  varying vec2 v_uv;

  uniform sampler2D u_logo;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_hover;
  uniform int u_variant; // 0=crimson-chrome, 1=molten-gold

  void main() {
    vec2 uv = v_uv;
    
    // Sample original logo mask
    vec4 mask = texture2D(u_logo, uv);
    if (mask.a < 0.02) {
      discard;
    }

    // Interactive mouse / hover displacement wave
    vec2 mNorm = u_mouse / u_resolution;
    float dist = length(uv - mNorm);
    float hoverWave = u_hover * sin(dist * 24.0 - u_time * 6.0) * exp(-dist * 4.0) * 0.04;

    // Organic fluid flow field
    float t = u_time * 1.8;
    float flow1 = sin(uv.x * 12.0 + t + uv.y * 6.0) * cos(uv.y * 12.0 - t * 0.8);
    float flow2 = cos(uv.x * 18.0 - t * 0.7) * sin(uv.y * 16.0 + t);
    float flow = (flow1 + flow2 * 0.5) * 0.035 + hoverWave;

    vec2 flowUv = uv + vec2(flow, -flow * 0.8);
    vec4 flowedMask = texture2D(u_logo, flowUv);

    // Normal calculation for Blinn-Phong specular sheen
    float eps = 0.008;
    float dX = (texture2D(u_logo, uv + vec2(eps, 0.0)).a - texture2D(u_logo, uv - vec2(eps, 0.0)).a);
    float dY = (texture2D(u_logo, uv + vec2(0.0, eps)).a - texture2D(u_logo, uv - vec2(0.0, eps)).a);

    vec3 normal = normalize(vec3(-dX * 4.0 + flow1 * 2.0, -dY * 4.0 + flow2 * 2.0, 1.0));
    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.2));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);

    float diffuse = max(dot(normal, lightDir), 0.0);
    float specular = pow(max(dot(normal, halfDir), 0.0), 28.0);
    float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    vec3 baseColor;
    vec3 highlightColor;
    vec3 deepColor;

    if (u_variant == 1) {
      // Molten Gold
      baseColor = vec3(0.96, 0.62, 0.04);     // Amber gold #F59E0B
      highlightColor = vec3(1.0, 0.98, 0.85); // Bright gold reflection
      deepColor = vec3(0.55, 0.22, 0.02);      // Copper shadow
    } else {
      // Crimson Chrome
      baseColor = vec3(0.92, 0.20, 0.14);     // Foodwok Vermilion #EB3223
      highlightColor = vec3(1.0, 0.92, 0.90); // Platinum silver sheen
      deepColor = vec3(0.50, 0.06, 0.05);      // Deep char burgundy
    }

    // Blend metallic liquid surface
    vec3 metal = mix(deepColor, baseColor, diffuse * 0.8 + 0.2);
    metal += highlightColor * specular * 1.35;
    metal += highlightColor * rim * 0.4;

    gl_FragColor = vec4(metal, mask.a);
  }
`;

export const LiquidLogo: React.FC<LiquidLogoProps> = ({
  size = 'md',
  variant = 'crimson-chrome',
  className = '',
  showText = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);

  const dim = SIZE_MAP[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      setHasWebGL(false);
      return;
    }

    // Compile helper
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('LiquidLogo shader error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VS_SOURCE);
    const fs = compile(gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) {
      setHasWebGL(false);
      return;
    }

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setHasWebGL(false);
      return;
    }

    gl.useProgram(prog);

    // Screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uResLoc = gl.getUniformLocation(prog, 'u_resolution');
    const uTimeLoc = gl.getUniformLocation(prog, 'u_time');
    const uMouseLoc = gl.getUniformLocation(prog, 'u_mouse');
    const uHoverLoc = gl.getUniformLocation(prog, 'u_hover');
    const uVariantLoc = gl.getUniformLocation(prog, 'u_variant');
    const uLogoLoc = gl.getUniformLocation(prog, 'u_logo');

    // Create 2D offscreen canvas to render the crisp "FW" mask
    const offscreen = document.createElement('canvas');
    const sz = 128;
    offscreen.width = sz;
    offscreen.height = sz;
    const ctx = offscreen.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, sz, sz);

      // Draw rounded wok shield container
      const r = 28;
      ctx.beginPath();
      ctx.roundRect(8, 8, sz - 16, sz - 16, r);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Punch out letters "FW"
      ctx.globalCompositeOperation = 'destination-out';
      ctx.font = '900 64px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('FW', sz / 2, sz / 2 + 3);

      // Add wok wok-curve base accent
      ctx.beginPath();
      ctx.arc(sz / 2, sz - 20, 24, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    }

    // Upload offscreen mask as WebGL texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offscreen);

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(uLogoLoc, 0);

    let animId: number;
    let startTime = performance.now();
    let currentHover = 0;

    const render = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const elapsed = (now - startTime) * 0.001;
      currentHover += ((isHovered ? 1.0 : 0.0) - currentHover) * 0.08;

      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uMouseLoc, mousePos.x * dpr, mousePos.y * dpr);
      gl.uniform1f(uHoverLoc, currentHover);
      gl.uniform1i(uVariantLoc, variant === 'molten-gold' ? 1 : 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buf);
    };
  }, [variant, isHovered, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: rect.height - (e.clientY - rect.top),
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      {/* Liquid Metal Crest Canvas Container */}
      <div
        className="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{ width: dim.box, height: dim.box }}
      >
        {/* Glow halo behind crest */}
        <div
          className={`absolute -inset-1.5 rounded-2xl blur-md opacity-60 transition-opacity duration-300 group-hover:opacity-100 ${
            variant === 'molten-gold' ? 'bg-amber-500/40' : 'bg-red-500/40'
          }`}
        />

        {/* Crisp static vector fallback underneath */}
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-xl font-black text-white shadow-md ${
            variant === 'molten-gold'
              ? 'bg-gradient-to-tr from-amber-600 to-amber-400'
              : 'bg-[#EB3223]'
          }`}
        >
          <span className="tracking-wider leading-none text-white">FW</span>
        </div>

        {/* WebGL Real-time Liquid Sheen Canvas */}
        {hasWebGL && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full rounded-xl z-10 pointer-events-none"
            style={{ width: dim.box, height: dim.box }}
          />
        )}
      </div>

      {/* Brand Typography */}
      {showText && (
        <span className={`font-black tracking-tight text-slate-900 group-hover:text-[#EB3223] transition-colors ${dim.text}`}>
          Foodwok
        </span>
      )}
    </div>
  );
};
