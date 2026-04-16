/**
 * ClinicMap Component
 * Phase 03-01: Clinic Search & Map
 * Uses Kakao Maps via WebView
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Clinic } from '../../types/clinic.types';

interface ClinicMapProps {
  clinics: Clinic[];
  selectedClinic?: Clinic | null;
  onMarkerPress?: (clinic: Clinic) => void;
  latitude: number;
  longitude: number;
}

const KAKAO_MAP_KEY = process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY || '';

export function ClinicMap({
  clinics,
  selectedClinic,
  onMarkerPress,
  latitude,
  longitude,
}: ClinicMapProps) {
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}"></script>
      <style>
        * { margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; }
        #map { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = new kakao.maps.Map(document.getElementById('map'), {
          center: new kakao.maps.LatLng(${latitude}, ${longitude}),
          level: 4
        });
        
        ${clinics.map(c => `
          (function() {
            const markerPosition = new kakao.maps.LatLng(${c.latitude}, ${c.longitude});
            const marker = new kakao.maps.Marker({
              position: markerPosition,
              title: '${c.name.replace(/'/g, "\\'")}'
            });
            marker.setMap(map);
            
            const infowindow = new kakao.maps.InfoWindow({
              content: '<div style="padding:5px;font-size:12px;">${c.name.replace(/'/g, "\\'")}</div>',
              removable: true
            });
            
            kakao.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map, marker);
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'marker', clinicId: '${c.id}' }));
            });
          })();
        `).join('')}
        
        // If selected clinic exists, pan to it
        ${selectedClinic ? `
          const selectedPos = new kakao.maps.LatLng(${selectedClinic.latitude}, ${selectedClinic.longitude});
          map.panTo(selectedPos);
        ` : ''}
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        source={{ html: mapHtml }}
        javaScriptEnabled
        originWhitelist={['*']}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'marker' && onMarkerPress) {
              const clinic = clinics.find(c => c.id === data.clinicId);
              if (clinic) {
                onMarkerPress(clinic);
              }
            }
          } catch {
            // Ignore parse errors
          }
        }}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1,
  },
});

export default ClinicMap;
