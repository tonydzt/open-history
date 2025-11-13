import { GeoLocation } from './Event';

// 定义故事地图数据类型
export interface StoryMapSlide {
    id: string;
    type?: string;
    date?: string;
    text: {
        headline: string;
        text: string;
    };
    location?: location;
    media?: {
        url?: string;
        credit?: string;
        caption?: string;
    };
}

export interface StoryMapData {
    storymap: {
        language: string;
        map_type: string;
        map_as_image: boolean;
        slides: StoryMapSlide[];
    };
}

export interface location {
    lat: number;
    lon: number;
};

export interface StoryMapCard {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  eventCount: number;
}

export const transformLocation = (location: GeoLocation): location => {
    // 增加location本身为空和字段为空判断
    if (!location || !location.lat || !location.lng) {
        return {
            lat: 39.9042,
            lon: 116.4074
        };
    }

    return {
        lat: location.lat,
        lon: location.lng
    };
};

/**
 * 将Event数据库类型转换为StoryMapSlide类型
 * @param event Event数据库模型
 * @returns StoryMapSlide类型数据
 */
export const transformEventToStoryMapSlide = (event: any): StoryMapSlide => {
    // 提取地理位置信息（如果存在）
    let slideLocation: location | undefined;
    if (event.geom) {
        // 从PostgreSQL的GEOGRAPHY格式中提取经纬度
        // 格式通常为"SRID=4326;POINT(lng lat)"
        const lat = parseFloat(event.geom.match(/POINT\(([^\s]+)\s+([^\)]+)\)/)?.[2] || '0');
        const lng = parseFloat(event.geom.match(/POINT\(([^\s]+)\s+([^\)]+)\)/)?.[1] || '0');
        
        if (lat && lng) {
            slideLocation = transformLocation({ lat, lng });
        }
    }

    return {
        id: event.id,
        date: event.date ? (event.date instanceof Date ? event.date.toISOString().split('T')[0] : event.date.split('T')[0]) : undefined,
        text: {
            headline: event.title || '',
            text: event.description || ''
        },
        location: slideLocation,
        media: {
            url: event.imageUrl || undefined,
            credit: event.user?.name || '未知用户',
            caption: ''
        }
    };
};