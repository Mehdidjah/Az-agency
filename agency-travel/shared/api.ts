/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Custom trip request payload
 */
export interface CustomTripRequest {
  fullName: string;
  phone: string;
  email: string;
  destinations: string[];
  startDate: string | null;
  endDate: string | null;
  budget: string;
  adults: number;
  children: number;
}

export interface CustomTripResponse {
  success: boolean;
  message: string;
}

/**
 * Reservation request payload (offer detail page)
 */
export interface ReservationRequest {
  fullName: string;
  phone: string;
  offerTitle?: string;
  offerId?: string;
  selectedHotel: string;
  adults: number;
  children: number;
  childDetails?: string;
  totalEstimated?: string;
  currency?: string;
}

export interface ReservationResponse {
  success: boolean;
  message: string;
  reservationId?: string;
}
