/**
 * Foodwok Dispatch API Mock / Distance-based Delivery Fee Calculator
 * Calculates location-relative delivery fees in Kobo based on delivery address & landmark.
 */

export interface DeliveryCalculationResult {
  feeInKobo: number;
  estimatedMinutes: string;
  zoneName: string;
  distanceKm: number;
}

export function calculateDeliveryFeeFromLocation(
  address: string,
  landmark?: string
): DeliveryCalculationResult {
  if (!address || address.trim() === '') {
    return {
      feeInKobo: 50000, // ₦500 default
      estimatedMinutes: '30–45',
      zoneName: 'Central Zone',
      distanceKm: 3.2,
    };
  }

  const fullLoc = `${address} ${landmark || ''}`.toLowerCase();

  // Zone 1: Victoria Island / Ikoyi (Kitchen Hub - Near distance)
  if (fullLoc.includes('victoria island') || fullLoc.includes('vi') || fullLoc.includes('ikoyi') || fullLoc.includes('adeola odeku')) {
    return {
      feeInKobo: 50000, // ₦500
      estimatedMinutes: '20–30',
      zoneName: 'Victoria Island / Ikoyi (Zone 1)',
      distanceKm: 2.5,
    };
  }

  // Zone 2: Lekki Phase 1 / Oniru (Short distance)
  if (fullLoc.includes('lekki phase 1') || fullLoc.includes('lekki 1') || fullLoc.includes('oniru') || fullLoc.includes('maroko')) {
    return {
      feeInKobo: 80000, // ₦800
      estimatedMinutes: '30–40',
      zoneName: 'Lekki Phase 1 / Oniru (Zone 2)',
      distanceKm: 5.8,
    };
  }

  // Zone 3: Lekki Phase 2 / Chevron / Ajah (Medium distance)
  if (fullLoc.includes('lekki') || fullLoc.includes('chevron') || fullLoc.includes('ajah') || fullLoc.includes('sangotedo')) {
    return {
      feeInKobo: 120000, // ₦1,200
      estimatedMinutes: '40–50',
      zoneName: 'Lekki / Ajah Axis (Zone 3)',
      distanceKm: 11.4,
    };
  }

  // Zone 4: Yaba / Surulere / Ebute Metta (Mainland Central)
  if (fullLoc.includes('yaba') || fullLoc.includes('surulere') || fullLoc.includes('ebute metta') || fullLoc.includes('unilag')) {
    return {
      feeInKobo: 150000, // ₦1,500
      estimatedMinutes: '45–60',
      zoneName: 'Yaba / Surulere Mainland (Zone 4)',
      distanceKm: 14.2,
    };
  }

  // Zone 5: Ikeja / Maryland / Magodo / Gbagada (Upper Mainland)
  if (fullLoc.includes('ikeja') || fullLoc.includes('maryland') || fullLoc.includes('gbagada') || fullLoc.includes('magodo') || fullLoc.includes('ojota')) {
    return {
      feeInKobo: 180000, // ₦1,800
      estimatedMinutes: '50–65',
      zoneName: 'Ikeja / Gbagada Axis (Zone 5)',
      distanceKm: 18.6,
    };
  }

  // Dynamic Algorithmic Dispatch Fee based on address hash / length for custom addresses
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  // Calculate relative fee between ₦600 (60,000 Kobo) and ₦1,600 (160,000 Kobo) in ₦100 increments
  const steps = (positiveHash % 11);
  const calculatedFeeInKobo = 60000 + steps * 10000;
  const distanceKm = Number((3 + steps * 1.2).toFixed(1));

  return {
    feeInKobo: calculatedFeeInKobo,
    estimatedMinutes: `${30 + steps * 2}–${45 + steps * 3}`,
    zoneName: `Calculated Delivery Zone (${distanceKm} km)`,
    distanceKm,
  };
}
