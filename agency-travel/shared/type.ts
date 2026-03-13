// Reusable types for the app (offers, hotels, gallery, reservations)

export type ID = string;

export interface Image {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Price {
  amount: number;
  currency: string; // e.g. "USD", "EUR"
  per?: 'person' | 'package' | string;
  original?: number; // original price if discounted
  discountPercent?: number;
}

export interface ProgramDay {
  day: number;
  title?: string;
  description?: string;
  locations?: string[];
  meals?: string[]; // e.g. ["breakfast", "dinner"]
  images?: Image[];
  isLast?: boolean;
}

export interface Hotel {
  id: ID;
  name: string;
  description?: string;
  stars?: number; // 1..5 (star rating)
  rating?: number; // 0..5
  address?: string;
  city?: string;
  country?: string;
  mainImage?: Image;
  images?: Image[];
  amenities?: string[];
  price?: Price;
  pricePerPerson?: string;
  currency?: string;
  dates?: string;
  distanceFromCenterKm?: number;
  transferIncluded?: boolean;
  breakfastIncluded?: boolean;
}

export interface Offer {
  id: ID;
  slug?: string;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  mainImage?: Image;
  images?: Image[]; // gallery images
  price: Price;
  durationDays?: number;
  durationNights?: number;
  numberOfDays?: number;
  location?: {
    country?: string;
    city?: string;
    address?: string;
    lat?: number;
    lng?: number;
  };
  time?: string;
  categories?: string[];
  inclusions?: string[];
  exclusions?: string[];
  program?: ProgramDay[];
  hotels?: Hotel[];
  availability?: { from: string; to?: string }[]; // ISO dates
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// More detailed shape used by the Offer detail page
export interface OfferDetail extends Offer {
  itinerary?: ProgramDay[]; // synonym for program
  policies?: {
    cancellation?: string;
    payment?: string;
    notes?: string;
  };
  terms?: string;
}

export interface ReservationRequest {
  offerId: ID;
  hotelId?: ID;
  startDate: string; // ISO date
  endDate?: string; // optional for open-ended reservations
  adults: number;
  children?: number;
  rooms?: number;
  extras?: string[];
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
