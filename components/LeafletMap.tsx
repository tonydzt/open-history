'use client';

import { useEffect, useRef } from 'react';
import { GeoLocation } from '@/types';
// Leaflet CSS 需要单独导入
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  initialGeom?: GeoLocation;
  onGeomChange: (geom: GeoLocation) => void;
}

export default function LeafletMap({ initialGeom, onGeomChange }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // 添加或更新标记
    const addMarker = (geom: GeoLocation) => {
      if (!mapInstanceRef.current) return;
      
      const L = require('leaflet');
      
      // 移除现有标记
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // 创建新标记，使用自定义样式解决默认图标问题
      markerRef.current = L.circleMarker([geom.lat, geom.lng], {
        radius: 8,
        fillColor: '#3b82f6',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      }).addTo(mapInstanceRef.current);
    };

    // 动态导入 Leaflet 库
    const initializeMap = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // 导入 Leaflet
        const L = await import('leaflet');
        
        // 初始化地图
        if (mapRef.current && !mapInstanceRef.current) {
          // 设置默认中心坐标
          const defaultCenter = initialGeom || { lat: 39.9042, lng: 116.4074 }; // 北京坐标作为默认位置
          
          // 创建地图实例
          mapInstanceRef.current = L.map(mapRef.current, {
            center: [defaultCenter.lat, defaultCenter.lng],
            zoom: 13,
            attributionControl: false
          });

          // 添加 OpenStreetMap 图层
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(mapInstanceRef.current);

          // 如果有初始位置，添加标记
          if (initialGeom) {
            addMarker(initialGeom);
          }

          // 监听地图点击事件，更新选中位置
          mapInstanceRef.current.on('click', (e: any) => {
            const newGeom = {
              lat: e.latlng.lat,
              lng: e.latlng.lng
            };
            addMarker(newGeom);
            onGeomChange(newGeom);
          });
        }
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
      }
    };

    // 当初始位置变化时，重新初始化地图以更新位置
    if (mapInstanceRef.current && initialGeom) {
      mapInstanceRef.current.setView([initialGeom.lat, initialGeom.lng], 13);
      
      // 使用 addMarker 函数保持一致性
      const L = require('leaflet');
      addMarker(initialGeom);
    }

    initializeMap();

    // 清理函数
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markerRef.current = null;
    };
  }, [initialGeom, onGeomChange]);

  return <div ref={mapRef} className="h-full w-full" style={{ height: '100%', width: '100%' }} />;
}