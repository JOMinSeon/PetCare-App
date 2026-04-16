# 카카오 지도 API 기술 설계 문서

**문서 버전:** 1.0
**작성일:** 2026-04-16
**프로젝트:** VitalPaw (반려동물 관리 앱)
**대상 화면:** `PetServiceMapScreen` - 주변 반려동물 서비스 지도

---

## 1. 개요

### 1.1 목적
반려동물 보호자가当前位置 기반 주변 동물병원, 펫숍, 미용실 등 반려동물 관련 서비스를 검색하고 확인할 수 있는 지도 기능 구현

### 1.2 카카오맵 선택 이유
- 한국院内 반려동물 서비스 정보覆盖面广
- Kakao SDK의ネイティブサポート (iOS/Android)
- 장소 검색, 길찾기, 전화 연동 등 기능一组

### 1.3 기술 선택: WebView 기반 구현
**선택 근거:**
| 방식 |pros|cons|
|------|----|----|
| Native SDK (react-native-kakao-maps) |高性能|Expo 호환 문제, 빌드 복잡 |
| **WebView (Kakao Map API)** | **Expo 호환, 빠른 구현** | **성능やや低い** |
| react-native-webview + Kakao SDK | Expo Prebuild 필요 | 中間的 |

**결론:** 초기 MVP는 WebView 기반 Kakao Map Embed API 사용 → 추후 Native SDK 마이그레이션 가능

---

## 2. 아키텍처

### 2.1 레이어 구조

```
┌─────────────────────────────────────────────────────┐
│                    UI Layer                          │
│  ┌─────────────────────────────────────────────────┐ │
│  │              PetServiceMapScreen                │ │
│  │  ┌─────────────┐  ┌────────────────────────┐   │ │
│  │  │  MapView    │  │   ServiceListPanel     │   │ │
│  │  │  (WebView)  │  │   (ScrollView/FlatList)│   │ │
│  │  └─────────────┘  └────────────────────────┘   │ │
│  └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│                  Hook Layer                         │
│  ┌─────────────────────────────────────────────────┐ │
│  │            useKakaoMap()                         │ │
│  │  - currentLocation    - selectedPlace            │ │
│  │  - places             - filters                  │ │
│  └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│                Service Layer                        │
│  ┌───────────────┐  ┌────────────────────────────┐ │
│  │ MapService    │  │ PlaceSearchService          │ │
│  │ - initMap     │  │ - searchNearby             │ │
│  │ - moveCamera  │  │ - getPlaceDetail           │ │
│  │ - addMarker   │  └────────────────────────────┘ │
│  └───────────────┘                                  │
├─────────────────────────────────────────────────────┤
│                API Layer                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │           Kakao Map REST API                     │ │
│  │  - 장소 검색 API                                 │ │
│  │  - 키워드 검색 API                               │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 2.2 폴더 구조

```
mobile/src/
├── screens/
│   └── PetServiceMapScreen.tsx    # 지도 메인 스크린
├── components/
│   ├── map/
│   │   ├── KakaoMapView.tsx       # WebView 기반 지도
│   │   ├── MapMarker.tsx          # 마커 컴포넌트
│   │   ├── MapControls.tsx         # 확대/축소, 현위치 버튼
│   │   └── ServiceListPanel.tsx   # 하단 서비스 목록
│   └── common/
│       ├── FilterChips.tsx        # 필터 칩
│       └── ServiceCard.tsx         # 서비스 정보 카드
├── hooks/
│   ├── useKakaoMap.ts              # 지도 상태/제어 훅
│   └── usePlaceSearch.ts           # 장소 검색 훅
├── services/
│   ├── kakaoMap.service.ts         # 카카오맵 API 서비스
│   └── place.service.ts            # 장소 데이터 서비스
├── types/
│   └── map.types.ts                 # 지도 관련 타입 정의
└── constants/
    └── map.constants.ts            # 필터, 기본값 등 상수
```

---

## 3. 타입 정의

### 3.1 map.types.ts

```typescript
export interface PetServicePlace {
  id: string;
  name: string;
  category: ServiceCategory;
  address: string;
  roadAddress: string;
  x: number;           // 경도 (Kakao API)
  y: number;           // 위도 (Kakao API)
  phone: string;
  distance?: number;   // 현재 위치からの距離 (km)
  rating?: number;
  isOpen: boolean;
  isEmergency: boolean;
  openHours?: string;
  thumbnailUrl?: string;
}

export type ServiceCategory = 
  | 'VET'           // 동물병원
  | 'PET_SHOP'      // 펫숍
  | 'GROOMING'      // 미용/욕조
  | 'EMERGENCY'     // 응급실
  | 'PET_HOTEL'     // 호텔
  | 'TRAINING';     // 훈련

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
  x: string;          // 경도
  y: string;           // 위도
  phone: string;
  place_url: string;
}

export interface KakaoSearchMeta {
  total_count: number;
  pageable_count: number;
  is_end: boolean;
}
```

---

## 4. API 연동 설계

### 4.1 카카오맵 REST API

```typescript
// kakaoMap.service.ts
const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;
const BASE_URL = 'https://dapi.kakao.com/v2/local';

export const MapService = {
  // 키워드 기반 장소 검색
  async searchByKeyword(
    keyword: string,
    latitude: number,
    longitude: number,
    radius: number = 3000
  ): Promise<PetServicePlace[]> {
    const response = await fetch(
      `${BASE_URL}/search/keyword.json?` +
      `query=${encodeURIComponent(keyword)}` +
      `&x=${longitude}&y=${latitude}` +
      `&radius=${radius}` +
      `&sort=distance`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );
    return this.transformKakaoResults(await response.json());
  },

  // 카테고리 기반 장소 검색
  async searchByCategory(
    categoryGroupCode: string,
    latitude: number,
    longitude: number,
    radius: number = 3000
  ): Promise<PetServicePlace[]> {
    const response = await fetch(
      `${BASE_URL}/category/code.json?` +
      `category_group_code=${categoryGroupCode}` +
      `&x=${longitude}&y=${latitude}` +
      `&radius=${radius}` +
      `&sort=distance`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );
    return this.transformKakaoResults(await response.json());
  },

  // 좌표로 주소 변환
  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<string> {
    const response = await fetch(
      `${BASE_URL}/geo/coord2address.json?` +
      `x=${longitude}&y=${latitude}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );
    const data = await response.json();
    return data.documents[0]?.address?.address_name || '';
  },

  transformKakaoResults(kakaoData: KakaoSearchResult): PetServicePlace[] {
    return kakaoData.documents.map((doc) => ({
      id: doc.id,
      name: doc.place_name,
      category: this.inferCategory(doc.category_name),
      address: doc.address_name,
      roadAddress: doc.road_address_name,
      x: parseFloat(doc.x),
      y: parseFloat(doc.y),
      phone: doc.phone,
      placeUrl: doc.place_url,
    }));
  },

  inferCategory(categoryName: string): ServiceCategory {
    if (categoryName.includes('동물') || categoryName.includes('수의')) return 'VET';
    if (categoryName.includes('애완') || categoryName.includes('펫숍')) return 'PET_SHOP';
    if (categoryName.includes('미용') || categoryName.includes('욕조')) return 'GROOMING';
    if (categoryName.includes('응급')) return 'EMERGENCY';
    if (categoryName.includes('호텔')) return 'PET_HOTEL';
    return 'PET_SHOP';
  },
};
```

### 4.2 카카오맵 카테고리 그룹 코드

| 카테고리 | 그룹 코드 |
|----------|-----------|
| 동물병원 | `HP8` (의료,福祉) |
| 펫숍 | `PS3` (판매) |
| 약국 | `PM9` (의료) |

### 4.3 WebView HTML 템플릿

```typescript
// constants/kakaoMapHtml.ts
export const KAKAO_MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=%APPKEY%&libraries=services"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    let map, markers = [], currentInfoWindow;

    function initMap(lat, lng) {
      map = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(lat, lng),
        level: 4
      });
      
      // 현위치 마커
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        image: new kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
          new kakao.maps.Size(24, 35)
        )
      });
      marker.setMap(map);
      
      // 지도 클릭 이벤트
      kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'MAP_CLICK',
          lat: mouseEvent.latLng.getLat(),
          lng: mouseEvent.latLng.getLng()
        }));
      });
    }

    function moveCamera(lat, lng, level = 4) {
      const moveLatLon = new kakao.maps.LatLng(lat, lng);
      map.setLevel(level);
      map.panTo(moveLatLon);
    }

    function addMarkers(places) {
      // 기존 마커 제거
      markers.forEach(m => m.setMap(null));
      markers = [];
      
      places.forEach((place) => {
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(place.y, place.x),
          title: place.place_name
        });
        
        const infoWindow = new kakao.maps.InfoWindow({
          content: '<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>'
        });
        
        kakao.maps.event.addListener(marker, 'click', function() {
          if (currentInfoWindow) currentInfoWindow.close();
          infoWindow.open(map, marker);
          currentInfoWindow = infoWindow;
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'MARKER_CLICK',
            place: place
          }));
        });
        
        marker.setMap(map);
        markers.push(marker);
      });
    }

    function fitMapToMarkers() {
      if (markers.length === 0) return;
      
      const bounds = new kakao.maps.LatLngBounds();
      markers.forEach(m => bounds.extend(m.getPosition()));
      map.setBounds(bounds);
    }
  </script>
</body>
</html>
`;
```

---

## 5. UI/UX 설계

### 5.1 화면 레이아웃

```
┌────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────┐  │
│  │                  헤더                         │  │
│  │  [←]     주변 서비스      [검색] [필터]      │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │                                              │  │
│  │              카카오맵 (WebView)              │  │
│  │                                              │  │
│  │           📍 (현위치 마커)                   │  │
│  │                                              │  │
│  │     [마커들...]                              │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  [24시간] [응급] [주차] [카시트]             │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │  사랑 동물병원             ⭐ 4.5      │  │  │
│  │  │  동물병원 · 24시간 · 응급             │  │  │
│  │  │  0.8km                      [전화][길]  │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │  네모펫 클리닉              ⭐ 4.2     │  │  │
│  │  │  미용/욕조                             │  │  │
│  │  │  1.2km                       [전화][길] │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────┤
│  [🏠홈] [🩺증상] [📍지도] [🍽️식단] [🏷️ID]        │
└────────────────────────────────────────────────────┘
```

### 5.2 컴포넌트 상세

| 컴포넌트 | 설명 | 상태 |
|----------|------|------|
| `KakaoMapView` | WebView 기반 지도 | 기본, 로딩중, 오류 |
| `MapControls` | 확대/축소, 현위치 버튼 | 기본, 비활성화 |
| `FilterChips` | 24시간, 응급, 주차 등 필터 | 기본, 선택됨 |
| `ServiceCard` | 서비스 정보 카드 | 기본, 선택됨, 영업중/휴무 |
| `ServiceListPanel` | 하단 스크롤 목록 | 기본, 빈 상태, 로딩중 |

### 5.3 사용자 플로우

```
1. 지도 탭 선택
   ↓
2. 현재 위치 요청 (권한 확인)
   ↓
3. 현위치 중심으로 지도 표시
   ↓
4. 주변 반려동물 서비스 자동 검색
   ↓
5. 마커 + 목록 표시
   ↓
6. 필터 선택 시 목록 갱신
   ↓
7. 카드/마커 선택 → 상세 정보 표시
   ↓
8. [전화하기] → 전화 앱 연동
   [길찾기] → 카카오맵 길찾기 실행
```

---

## 6. Hook 설계

### 6.1 useKakaoMap

```typescript
// hooks/useKakaoMap.ts
export function useKakaoMap() {
  const webviewRef = useRef<WebView>(null);
  const [region, setRegion] = useState<MapRegion>(DEFAULT_REGION);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [places, setPlaces] = useState<PetServicePlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PetServicePlace | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ServiceCategory[]>([]);

  // 메시지 핸들러 (WebView -> React Native)
  const handleWebViewMessage = useCallback((event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    switch (data.type) {
      case 'MAP_CLICK':
        setSelectedPlace(null);
        break;
      case 'MARKER_CLICK':
        setSelectedPlace(data.place);
        break;
    }
  }, []);

  // 지도 명령 전송
  const sendCommand = useCallback((command: string, payload?: any) => {
    webviewRef.current?.postMessage(JSON.stringify({ command, payload }));
  }, []);

  // 현위치로 이동
  const goToCurrentLocation = useCallback(() => {
    if (currentLocation) {
      sendCommand('moveCamera', {
        lat: currentLocation.lat,
        lng: currentLocation.lng
      });
    }
  }, [currentLocation, sendCommand]);

  // 장소 검색
  const searchPlaces = useCallback(async (location: {lat: number, lng: number}) => {
    setIsLoading(true);
    try {
      const results = await MapService.searchByCategory(
        'HP8', // 동물병원 카테고리
        location.lat,
        location.lng,
        5000
      );
      setPlaces(results);
      sendCommand('addMarkers', { places: results });
    } catch (error) {
      console.error('Place search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sendCommand]);

  // 필터 변경
  const toggleFilter = useCallback((category: ServiceCategory) => {
    setFilters(prev => 
      prev.includes(category) 
        ? prev.filter(f => f !== category)
        : [...prev, category]
    );
  }, []);

  return {
    webviewRef,
    region,
    currentLocation,
    places,
    selectedPlace,
    isLoading,
    filters,
    handleWebViewMessage,
    goToCurrentLocation,
    searchPlaces,
    toggleFilter,
    sendCommand,
  };
}
```

---

## 7. 환경 설정

### 7.1 .env 설정

```env
EXPO_PUBLIC_KAKAO_REST_API_KEY=your_kakao_rest_api_key_here
EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY=your_kakao_js_key_here
```

### 7.2 Android 설정 (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### 7.3 iOS 설정 (Info.plist)

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>반려동물 서비스 검색을 위해您的位置情報を使用します</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>반려동물 서비스 검색을 위해您的位置情報を使用します</string>
```

---

## 8. 구현 체크리스트

### Phase 1: 기본 지도
- [ ] 카카오 Developers에서 앱 생성 및 키 발급
- [ ] `.env`에 API 키 설정
- [ ] `KakaoMapView` WebView 컴포넌트 구현
- [ ] HTML 템플릿 로컬 서버 또는 번들링

### Phase 2: 위치 및 검색
- [ ] `expo-location`으로 현위치 획득
- [ ] `MapService.searchByCategory` 구현
- [ ] WebView 메시지 연동

### Phase 3: UI 완성
- [ ] `FilterChips` 컴포넌트
- [ ] `ServiceCard` 컴포넌트
- [ ] `ServiceListPanel` 스크롤 목록

### Phase 4: 액션 연동
- [ ] 전화하기 Linking
- [ ] 길찾기 (카카오맵 앱 or 웹)

---

## 9. 참고 자료

- [Kakao Map API 문서](https://apis.map.kakao.com/)
- [Kakao Developers](https://developers.kakao.com/)
- [react-native-webview](https://github.com/react-native-community/react-native-webview)
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/)
