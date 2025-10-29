'use client';

import { useEffect, useRef } from 'react';
import { GeoLocation } from '@/db/model/vo/Event';
// Leaflet CSS 需要单独导入
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  coordinates?: GeoLocation;
  initialGeom?: GeoLocation;
  interactive?: boolean;
  onGeomChange?: (geom: GeoLocation) => void;
}

export default function MapComponent({
  coordinates,
  initialGeom,
  interactive = false,
  onGeomChange
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // 获取要显示的位置坐标
  const displayCoordinates = coordinates || initialGeom;

  // 地图配置选项
  const mapOptions = {
    center: displayCoordinates 
      ? [displayCoordinates.lat, displayCoordinates.lng] as [number, number] 
      : [39.9042, 116.4074] as [number, number], // 北京坐标作为默认位置
    zoom: 13,
    attributionControl: !interactive || (interactive && true), // 静态地图显示attribution
    zoomControl: interactive, // 交互地图启用缩放控制
    dragging: interactive, // 交互地图启用拖动
    scrollWheelZoom: interactive, // 交互地图启用滚轮缩放
    doubleClickZoom: interactive, // 交互地图启用双击缩放
    boxZoom: interactive, // 交互地图启用框选缩放
    keyboard: interactive, // 交互地图启用键盘控制
    touchZoom: interactive, // 交互地图启用触摸缩放
  };

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
          // 创建地图实例
          mapInstanceRef.current = L.map(mapRef.current, mapOptions);

          // 添加 OpenStreetMap 图层
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(mapInstanceRef.current);

          // 如果有坐标，添加标记
          if (displayCoordinates) {
            addMarker(displayCoordinates);
          }

          // 如果是交互式地图，监听地图点击事件
          if (interactive && onGeomChange) {
            mapInstanceRef.current.on('click', (e: any) => {
              const newGeom = {
                lat: e.latlng.lat,
                lng: e.latlng.lng
              };
              addMarker(newGeom);
              onGeomChange(newGeom);
            });
          }
        }
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
      }
    };

    // 当初始位置变化时，更新地图位置
    if (mapInstanceRef.current && displayCoordinates) {
      mapInstanceRef.current.setView([displayCoordinates.lat, displayCoordinates.lng], 13);
      
      // 使用 addMarker 函数保持一致性
      const L = require('leaflet');
      addMarker(displayCoordinates);
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
  }, [displayCoordinates, interactive, onGeomChange, mapOptions]);

  return <div ref={mapRef} className="h-full w-full" style={{ height: '100%', width: '100%' }} />;
}