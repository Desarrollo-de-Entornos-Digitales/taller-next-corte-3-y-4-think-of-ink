'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Studio {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    rating: number;
    distance: string;
    image: string;
}

interface MapSectionProps {
    studios: Studio[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onMapReady: (map: L.Map) => void;
}

function createLeafletIcon() {
    const svgIcon = L.divIcon({
        className: '',
        html: `<div style="width:36px;height:36px;background:#111;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);cursor:pointer;transition:transform 0.2s;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -40],
    });

    const activeSvgIcon = L.divIcon({
        className: '',
        html: `<div style="width:44px;height:44px;background:#111;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.2s;transform:scale(1.15);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
        </div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -46],
    });

    return { svgIcon, activeSvgIcon };
}

export default function MapSection({ studios, selectedId, onSelect, onMapReady }: MapSectionProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<Map<string, L.Marker>>(new Map());

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: [3.4372, -76.525] as L.LatLngExpression,
            zoom: 13,
            zoomControl: true,
            scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        onMapReady(map);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markersRef.current.clear();
        };
    }, [onMapReady]);

    useEffect(() => {
        if (!mapInstanceRef.current) return;

        const map = mapInstanceRef.current;
        const { svgIcon, activeSvgIcon } = createLeafletIcon();

        const currentIds = new Set(markersRef.current.keys());
        const newIds = new Set(studios.map((s) => s.id));

        currentIds.forEach((id) => {
            if (!newIds.has(id)) {
                const marker = markersRef.current.get(id);
                if (marker) {
                    map.removeLayer(marker);
                    markersRef.current.delete(id);
                }
            }
        });

        studios.forEach((studio) => {
            const isSelected = studio.id === selectedId;
            const existing = markersRef.current.get(studio.id);

            if (existing) {
                if (isSelected) {
                    existing.setIcon(activeSvgIcon);
                } else {
                    existing.setIcon(svgIcon);
                }
            } else {
                const marker = L.marker([studio.lat, studio.lng], {
                    icon: isSelected ? activeSvgIcon : svgIcon,
                });

                marker.bindPopup(`
                    <div style="font-family:system-ui,sans-serif;padding:4px;min-width:180px;">
                        <p style="font-weight:700;font-size:14px;margin:0 0 4px;color:#111;">${studio.name}</p>
                        <p style="font-size:12px;margin:0 0 4px;color:#6B7280;">${studio.address}</p>
                        <p style="font-size:13px;margin:0;color:#111;font-weight:600;">
                            ⭐ ${studio.rating}
                        </p>
                    </div>
                `);

                marker.on('click', () => {
                    onSelect(studio.id);
                    map.flyTo([studio.lat, studio.lng], 15, { duration: 0.6 });
                });

                marker.addTo(map);
                markersRef.current.set(studio.id, marker);
            }
        });

        if (selectedId && markersRef.current.has(selectedId)) {
            const marker = markersRef.current.get(selectedId)!;
            marker.openPopup();
        }
    }, [studios, selectedId, onSelect]);

    return <div ref={mapContainerRef} className="w-full h-full z-0" />;
}
