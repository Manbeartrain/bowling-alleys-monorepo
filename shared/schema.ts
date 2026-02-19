// Bowling Alleys El Paso - Data Schema

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  website?: string;
  facebookUrl?: string;
  lanes: number;
  lat: number;
  lng: number;
  avgRating: number;
  reviewCount: number;
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
}

export interface Review {
  id: string;
  rating: number; // 1-5 integer
  text?: string; // Optional - allows star-only reviews
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
}

export interface User {
  id: string;
  displayName: string;
  photoURL?: string;
  createdAt: any; // Firebase Timestamp
}

export interface AppConfig {
  admins: string[]; // array of admin UIDs
}

// Seed data for bowling alleys
export const SEED_VENUES = [
  {
    id: "oasis-lanes",
    name: "Oasis Lanes",
    address: "1660 N Zaragoza Rd",
    city: "Texas",
    state: "TX",
    postalCode: "79936",
    lanes: 32,
    lat: 31.7645,
    lng: -106.2676,
    avgRating: 0,
    reviewCount: 0
  },
  {
    id: "monkey-rock",
    name: "Monkey Rock",
    address: "750 Sunland Park Dr Unit 100C",
    city: "Texas",
    state: "TX", 
    postalCode: "79912",
    lanes: 16,
    lat: 31.7849,
    lng: -106.5406,
    avgRating: 0,
    reviewCount: 0
  },
  {
    id: "bowl-el-paso",
    name: "Westside Bowl",
    address: "11144 Pellicano Dr",
    city: "Texas",
    state: "TX",
    postalCode: "79935", 
    lanes: 40,
    lat: 31.7396,
    lng: -106.3122,
    avgRating: 0,
    reviewCount: 0
  }
];
