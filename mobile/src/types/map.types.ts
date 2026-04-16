export interface PetServicePlace {
  id: string;
  name: string;
  category: ServiceCategory;
  address: string;
  roadAddress: string;
  x: number;
  y: number;
  phone: string;
  distance?: number;
  rating?: number;
  isOpen: boolean;
  isEmergency: boolean;
  openHours?: string;
  placeUrl?: string;
}

export type ServiceCategory =
  | 'VET'
  | 'PET_SHOP'
  | 'GROOMING'
  | 'EMERGENCY'
  | 'PET_HOTEL'
  | 'TRAINING';

export interface MapFilter {
  id: string;
  label: string;
  categories: ServiceCategory[];
  icon: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface KakaoSearchResult {
  documents: KakaoPlaceDocument[];
  meta: KakaoSearchMeta;
}

export interface KakaoPlaceDocument {
  id: string;
  place_name: string;
  category_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  phone: string;
  place_url: string;
}

export interface KakaoSearchMeta {
  total_count: number;
  pageable_count: number;
  is_end: boolean;
}

export interface WebViewMessage {
  type: 'MAP_CLICK' | 'MARKER_CLICK';
  lat?: number;
  lng?: number;
  place?: PetServicePlace;
}

export interface WebViewCommand {
  command: 'moveCamera' | 'addMarkers' | 'fitMapToMarkers';
  payload?: any;
}
