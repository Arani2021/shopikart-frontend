/**
 * Delivery Date Calculator (Frontend)
 * Mirrors the backend logic for quick client-side calculation
 */

const WAREHOUSE_STATE = "West Bengal";

// State information for India (mapping PIN prefixes to states)
const PIN_TO_STATE = {
  "70": "West Bengal",
  "71": "West Bengal",
  "72": "West Bengal",
  "73": "West Bengal",
  "74": "West Bengal",
  "75": "West Bengal",
  "50": "Telangana",
  "51": "Telangana",
  "40": "Andhra Pradesh",
  "41": "Andhra Pradesh",
  "42": "Andhra Pradesh",
  "20": "Andhra Pradesh",
  "21": "Andhra Pradesh",
  "30": "Karnataka",
  "31": "Karnataka",
  "32": "Karnataka",
  "33": "Karnataka",
  "34": "Karnataka",
  "35": "Karnataka",
  "36": "Karnataka",
  "10": "Gujarat",
  "11": "Gujarat",
  "12": "Gujarat",
  "13": "Gujarat",
  "14": "Gujarat",
  "15": "Gujarat",
  "60": "Maharashtra",
  "61": "Maharashtra",
  "62": "Maharashtra",
  "63": "Maharashtra",
  "64": "Maharashtra",
  "65": "Maharashtra",
  "66": "Maharashtra",
  "80": "Tamil Nadu",
  "81": "Tamil Nadu",
  "82": "Tamil Nadu",
  "83": "Tamil Nadu",
  "84": "Tamil Nadu",
  "85": "Tamil Nadu",
  "90": "Kerala",
  "91": "Kerala",
  "92": "Kerala",
  "25": "Uttar Pradesh",
  "26": "Uttar Pradesh",
  "27": "Uttar Pradesh",
  "28": "Uttar Pradesh",
  "37": "Rajasthan",
  "38": "Rajasthan",
  "39": "Rajasthan",
};

const NEIGHBORING_STATES = ["Assam", "Bihar", "Jharkhand", "Odisha"];
const MODERATE_DISTANCE_STATES = [
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Rajasthan",
  "Gujarat",
  "Delhi",
  "Punjab",
  "Haryana",
];
const FAR_DISTANCE_STATES = [
  "Tamil Nadu",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
  "Kerala",
  "Maharashtra",
];

/**
 * Get state from PIN code
 */
export function getStateFromPin(pincode) {
  if (!pincode || pincode.length < 2) return "Unknown";
  const prefix = pincode.substring(0, 2);
  return PIN_TO_STATE[prefix] || "Unknown";
}

/**
 * Calculate delivery days based on states
 */
function calculateDeliveryDays(sourceState, destState) {
  // Same state
  if (sourceState === destState) {
    return { minDays: 2, maxDays: 3 };
  }

  // Neighboring states
  if (NEIGHBORING_STATES.includes(destState)) {
    return { minDays: 3, maxDays: 4 };
  }

  // Moderate distance
  if (MODERATE_DISTANCE_STATES.includes(destState)) {
    return { minDays: 4, maxDays: 6 };
  }

  // Far distance
  if (FAR_DISTANCE_STATES.includes(destState)) {
    return { minDays: 5, maxDays: 7 };
  }

  // Default
  return { minDays: 6, maxDays: 8 };
}

/**
 * Format date as DD-MMM-YYYY
 */
export function formatDate(date) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-IN", options);
}

/**
 * Calculate estimated delivery date
 */
export function calculateDeliveryDate(userPin, userState = null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Determine user's state
  let state = userState;
  if (!state) {
    state = getStateFromPin(userPin);
  }

  // Get delivery days range
  const { minDays, maxDays } = calculateDeliveryDays(WAREHOUSE_STATE, state);

  // Calculate dates
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + minDays);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + maxDays);

  // Use average date as estimated delivery date
  const estimatedDeliveryDate = new Date(today);
  const avgDays = Math.ceil((minDays + maxDays) / 2);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + avgDays);

  return {
    estimatedDeliveryDate,
    minDate,
    maxDate,
    deliveryDays: { min: minDays, max: maxDays },
    state,
    formattedEstimate: formatDate(estimatedDeliveryDate),
    formattedMin: formatDate(minDate),
    formattedMax: formatDate(maxDate),
  };
}

/**
 * Get delivery estimate as string
 */
export function getDeliveryEstimate(deliveryInfo) {
  const { deliveryDays, formattedMin, formattedMax } = deliveryInfo;
  return `Delivery in ${deliveryDays.min}-${deliveryDays.max} days (${formattedMin} - ${formattedMax})`;
}
