export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  kilometers: number;
  plate: string;
  price: number;
  description: string;
  seats: number;
  doors?: number;
  status: string;
  transmission: string;
  fuel: string;
  category: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  // Location data from backend
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  distance?: number;
}

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}

/**
 * Convert degrees to radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}