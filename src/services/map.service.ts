const BASE_URL = 'https://dapi.kakao.com/v2/local';

interface KakaoSearchResult {
  documents: KakaoPlaceDocument[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

interface KakaoPlaceDocument {
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

export interface PetServicePlace {
  id: string;
  name: string;
  category: string;
  address: string;
  roadAddress: string;
  x: number;
  y: number;
  phone: string;
  isOpen: boolean;
  isEmergency: boolean;
  placeUrl: string;
}

const CATEGORY_GROUP_CODES: Record<string, string> = {
  VET: 'HP8',
  PET_SHOP: 'PS3',
  GROOMING: 'SC4',
  EMERGENCY: 'HP8',
  PET_HOTEL: 'AD5',
  TRAINING: 'CT1',
};

export const MapService = {
  async searchByKeyword(
    keyword: string,
    latitude: number,
    longitude: number,
    radius: number = 3000,
    apiKey: string
  ): Promise<PetServicePlace[]> {
    const response = await fetch(
      `${BASE_URL}/search/keyword.json?` +
      `query=${encodeURIComponent(keyword)}&x=${longitude}&y=${latitude}&radius=${radius}&sort=distance`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    );
    const data: KakaoSearchResult = await response.json();
    return this.transformResults(data);
  },

  async searchByCategory(
    category: string,
    latitude: number,
    longitude: number,
    radius: number = 3000,
    apiKey: string
  ): Promise<PetServicePlace[]> {
    const groupCode = CATEGORY_GROUP_CODES[category];
    const response = await fetch(
      `${BASE_URL}/category/code.json?` +
      `category_group_code=${groupCode}&x=${longitude}&y=${latitude}&radius=${radius}&sort=distance`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    );
    const data: KakaoSearchResult = await response.json();
    return this.transformResults(data);
  },

  async reverseGeocode(
    latitude: number,
    longitude: number,
    apiKey: string
  ): Promise<string> {
    const response = await fetch(
      `${BASE_URL}/geo/coord2address.json?x=${longitude}&y=${latitude}`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    );
    const data = await response.json();
    return data.documents[0]?.address?.address_name || '';
  },

  transformResults(kakaoData: KakaoSearchResult): PetServicePlace[] {
    return kakaoData.documents.map(doc => this.transformDocument(doc));
  },

  transformDocument(doc: KakaoPlaceDocument): PetServicePlace {
    return {
      id: doc.id,
      name: doc.place_name,
      category: this.inferCategory(doc.category_name),
      address: doc.address_name,
      roadAddress: doc.road_address_name,
      x: parseFloat(doc.x),
      y: parseFloat(doc.y),
      phone: doc.phone,
      isOpen: true,
      isEmergency: doc.category_name.includes('응급'),
      placeUrl: doc.place_url,
    };
  },

  inferCategory(categoryName: string): string {
    if (categoryName.includes('동물') || categoryName.includes('수의')) return 'VET';
    if (categoryName.includes('애완') || categoryName.includes('펫숍')) return 'PET_SHOP';
    if (categoryName.includes('미용') || categoryName.includes('욕조')) return 'GROOMING';
    if (categoryName.includes('응급')) return 'EMERGENCY';
    if (categoryName.includes('호텔')) return 'PET_HOTEL';
    if (categoryName.includes('훈련')) return 'TRAINING';
    return 'PET_SHOP';
  },
};
