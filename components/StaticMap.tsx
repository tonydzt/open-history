"use client";

import { useRef, useEffect } from 'react';
import { GeoLocation } from '@/types';

// StaticMap 组件 - 用于显示静态地图
const StaticMap = ({ coordinates }: { coordinates: GeoLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // 动态导入 Leaflet 库
    const initializeMap = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // 导入 Leaflet
        const L = await import('leaflet');
        
        // 初始化地图
        if (mapRef.current && !mapInstanceRef.current) {
          // 创建地图实例
          mapInstanceRef.current = L.map(mapRef.current, {
          center: [coordinates.lat, coordinates.lng],
          zoom: 13,
          attributionControl: true,
          zoomControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
          touchZoom: false
        });

          // 添加 OpenStreetMap 图层
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(mapInstanceRef.current);

          // 添加标记（使用圆形标记替代默认图标）
          L.circleMarker([coordinates.lat, coordinates.lng], {
            radius: 8,
            fillColor: '#3b82f6',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
          }).addTo(mapInstanceRef.current);
        }
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
      }
    };

    initializeMap();

    // 清理函数
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates]);

  return <div ref={mapRef} className="h-full w-full" style={{ height: '100%', width: '100%' }} />;
};

export default StaticMap;