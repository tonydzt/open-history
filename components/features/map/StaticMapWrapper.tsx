'use client';

import { GeoLocation } from '@/types';
import MapComponent from './MapComponent';

interface StaticMapProps {
  coordinates: GeoLocation;
}

export default function StaticMapWrapper({ coordinates }: StaticMapProps) {
  // 使用新的MapComponent，设置为静态模式
  return (
    <MapComponent 
      coordinates={coordinates} 
      interactive={false} 
    />
  );
}