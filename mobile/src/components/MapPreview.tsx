import { useRef, useCallback } from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'

interface Marker {
  id: string
  lat: number
  lon: number
  label: string
  color?: string
}

interface MapPreviewProps {
  markers: Marker[]
  centerLat?: number | null
  centerLon?: number | null
  zoom?: number
  aspectRatio?: number
  onMarkerPress?: (id: string) => void
}

const PIN_COLORS: Record<string, string> = {
  'red-pushpin': '#d03238',
  'blue-pushpin': '#1a6070',
  'green-pushpin': '#2c7a4a',
  'olive-pushpin': '#4d7f16',
  'orange-pushpin': '#c2860e',
  'ltblu-pushpin': '#2ead4b',
}

function buildHtml(markers: Marker[], centerLat: number | null, centerLon: number | null, zoom: number): string {
  const jsMarkers = JSON.stringify(
    markers.map((m, i) => ({
      id: m.id,
      idx: i,
      lat: m.lat,
      lon: m.lon,
      label: m.label.replace(/'/g, "\\'").replace(/"/g, '\\"'),
      color: PIN_COLORS[m.color ?? 'red-pushpin'] ?? '#d03238',
    }))
  )

  const clat = centerLat ?? markers[0]?.lat ?? 36.75
  const clon = centerLon ?? markers[0]?.lon ?? 3.05

  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  * { margin:0; padding:0; }
  html, body { width:100%; height:100%; overflow:hidden; }
  #map { width:100%; height:100vh; }
  .marker-label {
    background: rgba(0,0,0,0.75);
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 11px;
    padding: 3px 7px;
    white-space: nowrap;
  }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var map = L.map('map', {
    center: [${clat}, ${clon}],
    zoom: ${zoom},
    zoomControl: true,
    attributionControl: false,
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(map);

  var markers = ${jsMarkers};

  markers.forEach(function(m) {
    var icon = L.divIcon({
      className: '',
      html: '<div style="width:14px;height:14px;border-radius:50%;background:' + m.color + ';border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.5);"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    var marker = L.marker([m.lat, m.lon], { icon: icon }).addTo(map);
    marker.bindTooltip(m.label, {
      direction: 'top',
      offset: [0, -10],
      className: 'marker-label',
    });

    marker.on('click', function() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: m.id }))
      }
    });
  });

  if (markers.length > 1) {
    var group = new L.featureGroup(markers.map(function(m) {
      return L.marker([m.lat, m.lon]);
    }));
    map.fitBounds(group.getBounds().pad(0.15));
  }
</script>
</body>
</html>`
}

export function MapPreview({ markers, centerLat, centerLon, zoom = 13, aspectRatio = 2, onMarkerPress }: MapPreviewProps) {
  const { width } = useWindowDimensions()
  const webViewRef = useRef<WebView>(null)

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === 'markerPress' && data.id) {
        onMarkerPress?.(data.id)
      }
    } catch {
      // ignore malformed messages
    }
  }, [onMarkerPress])

  if (markers.length === 0) return null

  const w = Math.min(width - 48, 600)
  const h = Math.round(w / aspectRatio)
  const html = buildHtml(markers, centerLat ?? null, centerLon ?? null, zoom)

  return (
    <View style={[styles.container, { width: w, height: h }]}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        style={{ width: w, height: h }}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        cacheEnabled
        originWhitelist={['*']}
        onMessage={handleMessage}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e8ebe6',
  },
})
