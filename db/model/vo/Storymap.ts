import { GeoLocation } from './Event';

// 定义故事地图数据类型
export interface StoryMapSlide {
    type?: string;
    date: string;
    text: {
        headline: string;
        text: string;
    };
    location: location;
    zoom: number;
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
}