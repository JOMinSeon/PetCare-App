import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { KAKAO_MAP_HTML, DEFAULT_REGION } from '../../constants/map.constants';
import { PetServicePlace, WebViewMessage, WebViewCommand } from '../../types/map.types';
import { theme } from '../../theme';

interface Props {
  latitude: number;
  longitude: number;
  places: PetServicePlace[];
  onMapClick?: () => void;
  onMarkerClick?: (place: PetServicePlace) => void;
  onMapReady?: () => void;
}

export default function KakaoMapView({
  latitude,
  longitude,
  places,
  onMapClick,
  onMarkerClick,
  onMapReady,
}: Props) {
  const webviewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const appKey = process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY || '';

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'MAP_CLICK':
          onMapClick?.();
          break;
        case 'MARKER_CLICK':
          if (data.place) {
            onMarkerClick?.(data.place);
          }
          break;
        case 'MAP_ERROR':
          setErrorMessage(data.message);
          setHasError(true);
          break;
      }
    } catch {}
  }, [onMapClick, onMarkerClick]);

  const sendCommand = useCallback((command: WebViewCommand) => {
    webviewRef.current?.postMessage(JSON.stringify(command));
  }, []);

  useEffect(() => {
    if (!isLoading && !hasError && latitude && longitude) {
      sendCommand({
        command: 'moveCamera',
        payload: { lat: latitude, lng: longitude, level: 4 },
      });
    }
  }, [latitude, longitude, isLoading, hasError, sendCommand]);

  useEffect(() => {
    if (!isLoading && !hasError && places.length > 0) {
      sendCommand({ command: 'addMarkers', payload: { places } });
    }
  }, [places, isLoading, hasError, sendCommand]);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
    onMapReady?.();
  }, [onMapReady]);

  const handleError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setErrorMessage(nativeEvent.description || 'Failed to load map');
    setHasError(true);
    setIsLoading(false);
  }, []);

  if (!appKey || appKey === 'your_kakao_javascript_key_here') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>카카오맵 API 키가 설정되지 않았습니다</Text>
        <Text style={styles.errorSubtext}>.env 파일에 EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY를 설정하세요</Text>
        <Text style={styles.errorSubtext}>현재 키: {appKey || '(없음)'}</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>지도를 불러오지 못했습니다</Text>
        <Text style={styles.errorSubtext}>{errorMessage}</Text>
        <Text style={styles.errorSubtext}>앱 키: {appKey.substring(0, 10)}...</Text>
      </View>
    );
  }

  const htmlContent = KAKAO_MAP_HTML(appKey);

  const injectedJS = `
    window.kakaoInitialized = false;
    
    function initMap(lat, lng) {
      if (typeof kakao === 'undefined' || typeof kakao.maps === 'undefined') {
        console.error('Kakao Maps not loaded');
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'MAP_ERROR',
          message: 'Kakao Maps SDK not loaded. Check app key.'
        }));
        return;
      }
      
      map = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(lat, lng),
        level: 4
      });
      
      var marker = new kakao.maps.Marker({
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
      
      window.kakaoInitialized = true;
    }
    
    function addMarkers(places) {
      if (!window.kakaoInitialized) return;
      
      markers.forEach(function(m) { m.setMap(null); });
      markers = [];
      
      places.forEach(function(place) {
        var marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(place.y, place.x),
          title: place.name
        });
        
        var infoWindow = new kakao.maps.InfoWindow({
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
    
    function moveCamera(lat, lng, level) {
      if (!window.kakaoInitialized) return;
      var moveLatLon = new kakao.maps.LatLng(lat, lng);
      map.setLevel(level || 4);
      map.panTo(moveLatLon);
    }
    
    setTimeout(function() {
      initMap(${latitude}, ${longitude});
    }, 1000);
    
    true;
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        style={styles.webview}
        injectedJavaScript={injectedJS}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>지도 로딩 중...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 13,
    color: theme.colors.onSurfaceLight,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
