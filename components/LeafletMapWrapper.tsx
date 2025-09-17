'use client';

import { GeoLocation } from '@/types';
import MapComponent from './MapComponent';

interface LeafletMapProps {
  initialGeom?: GeoLocation;
  onGeomChange: (geom: GeoLocation) => void;
}

export default function LeafletMapWrapper({ initialGeom, onGeomChange }: LeafletMapProps) {
  // 使用新的MapComponent，设置为交互式模式
  return (
    <MapComponent 
      initialGeom={initialGeom} 
      interactive={true} 
      onGeomChange={onGeomChange} 
    />
  );
}