import { Submission, ProposedProject } from '../types';

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Calculates the distance between two coordinates in kilometers using the Haversine formula.
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
}

/**
 * Derives stable coordinates for a project based on the centroid of submissions in its category.
 */
export function getProjectCoordinates(
  proj: ProposedProject,
  submissions: Submission[],
  fallbackCenter: LatLng | null
): LatLng | null {
  // Find centroid of matching category submissions in the system
  const matchingSubs = submissions.filter(
    s => s.category === proj.category && s.latitude && s.longitude
  );

  if (matchingSubs.length > 0) {
    const latSum = matchingSubs.reduce((sum, s) => sum + (s.latitude || 0), 0);
    const lngSum = matchingSubs.reduce((sum, s) => sum + (s.longitude || 0), 0);
    
    // Add a small deterministic offset based on project ID to prevent overlay stacking
    const hash = proj.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const offsetLat = ((hash % 10) - 5) * 0.0006;
    const offsetLng = (((hash >> 2) % 10) - 5) * 0.0006;

    return {
      lat: (latSum / matchingSubs.length) + offsetLat,
      lng: (lngSum / matchingSubs.length) + offsetLng
    };
  } else if (fallbackCenter) {
    // Fallback scatter around fallback center
    const hash = proj.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const offsetLat = ((hash % 16) - 8) * 0.0015;
    const offsetLng = (((hash >> 3) % 16) - 8) * 0.0015;
    return {
      lat: fallbackCenter.lat + offsetLat,
      lng: fallbackCenter.lng + offsetLng
    };
  }
  return null;
}
