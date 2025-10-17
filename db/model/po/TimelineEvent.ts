/**
 * 时间轴事件关系表数据模型（数据库持久化对象）
 */
export interface TimelineEvent {
  /**
   * 关系记录唯一标识符
   */
  id: string;
  
  /**
   * 时间轴ID
   */
  timelineId: string;
  
  /**
   * 事件ID
   */
  eventId: string;
  
  /**
   * 创建时间
   */
  createdAt: string;
  
  /**
   * 更新时间
   */
  updatedAt: string;
}