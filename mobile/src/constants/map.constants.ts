import { ServiceCategory, MapFilter } from '../types/map.types';

export const DEFAULT_REGION = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const MAP_FILTERS: MapFilter[] = [
  {
    id: '24h',
    label: '24시간',
    categories: ['EMERGENCY'],
    icon: '🕐',
  },
  {
    id: 'emergency',
    label: '응급',
    categories: ['EMERGENCY'],
    icon: '🏥',
  },
  {
    id: 'vet',
    label: '동물병원',
    categories: ['VET'],
    icon: '🩺',
  },
  {
    id: 'petshop',
    label: '펫숍',
    categories: ['PET_SHOP'],
    icon: '🏪',
  },
  {
    id: 'grooming',
    label: '미용',
    categories: ['GROOMING'],
    icon: '✂️',
  },
];

export const KAKAO_MAP_HTML = (appKey: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services"></script>
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
      
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        image: new kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
          new kakao.maps.Size(24, 35)
        )
      });
      marker.setMap(map);
      
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
      markers.forEach(m => m.setMap(null));
      markers = [];
      
      places.forEach((place) => {
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(place.y, place.x),
          title: place.name
        });
        
        const infoWindow = new kakao.maps.InfoWindow({
          content: '<div style="padding:8px;font-size:13px;font-weight:500;">' + place.name + '</div>'
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
