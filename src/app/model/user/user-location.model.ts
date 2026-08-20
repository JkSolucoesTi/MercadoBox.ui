export interface UserLocationAddress {
  formattedAddress: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date | string;
  address?: UserLocationAddress | null;
}

export enum LocationStatus {
  NOT_IDENTIFIED = 'NOT_IDENTIFIED',
  REQUESTING = 'REQUESTING',
  IDENTIFIED = 'IDENTIFIED',
  DENIED = 'DENIED',
  UNAVAILABLE = 'UNAVAILABLE',
  ERROR = 'ERROR'
}
