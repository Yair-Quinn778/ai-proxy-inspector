import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Use CDN marker icons (compatible with Vite bundling)
const iconDefault = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface IPMapProps {
  latitude: number;
  longitude: number;
  location: string;
}

export default function IPMap({ latitude, longitude, location }: IPMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView(
      [latitude, longitude],
      10
    );

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    markerRef.current = L.marker([latitude, longitude], { icon: iconDefault })
      .addTo(mapInstanceRef.current)
      .bindPopup(`<b>${location}</b><br/>${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

    L.circle([latitude, longitude], {
      color: "#3b82f6",
      fillColor: "#3b82f6",
      fillOpacity: 0.1,
      radius: 5000,
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, location]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([latitude, longitude], 10);
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      markerRef.current.setPopupContent(
        `<b>${location}</b><br/>${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      );
    }
  }, [latitude, longitude, location]);

  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <div ref={mapRef} className="h-[400px] w-full" />
    </div>
  );
}
