import { GeoLocation } from './index';

// MapComponent 组件的属性类型定义
export interface MapComponentProps {
  coordinates?: GeoLocation;
  initialGeom?: GeoLocation;
  interactive?: boolean;
  onGeomChange?: (geom: GeoLocation) => void;
}