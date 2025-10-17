/**
 * 时间轴数据模型（数据库持久化对象）
 */
export interface Timeline {
  /**
   * 时间轴唯一标识符
   */
  id: string;
  
  /**
   * 时间轴标题
   */
  title: string;
  
  /**
   * 时间轴描述
   */
  description?: string;
  
  /**
   * 背景颜色（十六进制颜色值）
   */
  backgroundColor?: string;
  
  /**
   * 背景图片URL
   */
  backgroundImageUrl?: string;
  
  /**
   * 背景图片替代文本
   */
  backgroundImageAlt?: string;
  
  /**
   * 作者ID
   */
  authorId: string;
  
  /**
   * 创建时间
   */
  createdAt: string;
  
  /**
   * 更新时间
   */
  updatedAt: string;
}