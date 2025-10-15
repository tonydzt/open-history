export interface Date {
  /**
   * 年份，BCE年份使用负数
   */
  year: number;
  /**
   * 月份（可选），1-12
   */
  month?: number;
  /**
   * 日期（可选），1-31
   */
  day?: number;
  /**
   * 小时（可选），0-23
   */
  hour?: number;
  /**
   * 分钟（可选），0-59
   */
  minute?: number;
  /**
   * 秒（可选），0-59
   */
  second?: number;
  /**
   * 毫秒（可选），0-999
   */
  millisecond?: number;
  /**
   * 时代标记（可选），如"CE"或"BCE"
   */
  era?: string;
}

export interface Text {
  /**
   * 标题文本
   */
  headline?: string;
  /**
   * 正文文本
   */
  text?: string;
}

export interface Media {
  /**
   * 媒体URL
   */
  url?: string;
  /**
   * 媒体标题或说明
   */
  caption?: string;
  /**
   * 媒体来源信用
   */
  credit?: string;
  /**
   * 媒体链接
   */
  link?: string;
  /**
   * 媒体缩略图URL（可选）
   */
  thumbnail?: string;
}

export interface Background {
  /**
   * 背景图片URL
   */
  url?: string;
  /**
   * 背景图片替代文本
   */
  alt?: string;
  /**
   * 背景颜色，十六进制或CSS颜色关键字
   */
  color?: string;
}

export interface Slide {
  /**
   * 开始日期
   */
  start_date?: Date;
  /**
   * 结束日期（可选）
   */
  end_date?: Date;
  /**
   * 文本内容（可选）
   */
  text?: Text;
  /**
   * 媒体内容（可选）
   */
  media?: Media;
  /**
   * 分组名称（可选），用于将事件分组到同一行
   */
  group?: string;
  /**
   * 显示日期（可选），覆盖自动生成的日期显示
   */
  display_date?: string;
  /**
   * 背景设置（可选）
   */
  background?: Background;
  /**
   * 是否自动链接文本中的URL（可选），默认为true
   */
  autolink?: boolean;
  /**
   * 唯一标识符（可选）
   */
  unique_id?: string;
}

export interface Era {
  /**
   * 时代开始日期
   */
  start_date: Date;
  /**
   * 时代结束日期
   */
  end_date: Date;
  /**
   * 时代文本内容（可选）
   */
  text?: Text;
  /**
   * 时代背景设置（可选）
   */
  background?: Background;
  /**
   * 时代唯一标识符（可选）
   */
  unique_id?: string;
}

export type TimelineScale = 'human' | 'cosmological';

export interface Timeline {
  /**
   * 事件列表，必需
   */
  events: Slide[];
  /**
   * 标题幻灯片（可选）
   */
  title?: Slide;
  /**
   * 时代列表（可选）
   */
  eras?: Era[];
  /**
   * 时间尺度（可选），默认为'human'
   */
  scale?: TimelineScale;
}


