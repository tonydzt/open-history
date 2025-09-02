import { Event, Perspective, CreateEventData, CreatePerspectiveData } from '@/types';

// 模拟数据
const mockEvents: Event[] = [
  {
    id: '1',
    title: '2024年科技峰会',
    description: '全球顶尖科技公司齐聚一堂，探讨AI、区块链等前沿技术发展趋势。会议吸引了来自50多个国家的2000多名参与者，成为年度最重要的科技盛会。',
    timestamp: '2024-03-15T09:00:00Z',
    sourceType: 'news',
    images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
    tags: ['科技', 'AI', '峰会', '创新'],
    authorId: 'user1',
    author: {
      id: 'user1',
      name: '张三',
      email: 'zhangsan@example.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    id: '2',
    title: '城市马拉松比赛',
    description: '年度城市马拉松比赛吸引了超过10000名跑者参与，路线贯穿城市主要地标，展现了城市的活力与魅力。',
    timestamp: '2024-03-20T07:00:00Z',
    sourceType: 'social',
    images: ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800'],
    tags: ['体育', '马拉松', '健康', '城市'],
    authorId: 'user2',
    author: {
      id: 'user2',
      name: '李四',
      email: 'lisi@example.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    createdAt: '2024-03-18T14:00:00Z',
    updatedAt: '2024-03-18T14:00:00Z'
  },
  {
    id: '3',
    title: '环保志愿者活动',
    description: '全市环保志愿者联合开展了清洁海岸线行动，共有500多名志愿者参与，清理了近10吨海洋垃圾。',
    timestamp: '2024-03-25T08:00:00Z',
    sourceType: 'social',
    images: ['https://images.unsplash.com/photo-1455587734955-081b22074882?w=800'],
    tags: ['环保', '志愿者', '海洋', '公益'],
    authorId: 'user3',
    author: {
      id: 'user3',
      name: '王五',
      email: 'wangwu@example.com',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'
    },
    createdAt: '2024-03-22T11:00:00Z',
    updatedAt: '2024-03-22T11:00:00Z'
  },
  {
    id: '4',
    title: '国际美食节',
    description: '来自全球20多个国家的美食齐聚一堂，让市民在家门口就能品尝到世界各地的特色美食。',
    timestamp: '2024-04-01T10:00:00Z',
    sourceType: 'other',
    images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'],
    tags: ['美食', '文化', '国际', '烹饪'],
    authorId: 'user4',
    author: {
      id: 'user4',
      name: '赵六',
      email: 'zhaoliu@example.com',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    createdAt: '2024-03-28T16:00:00Z',
    updatedAt: '2024-03-28T16:00:00Z'
  },
  {
    id: '5',
    title: '科技创新展览',
    description: '最新的VR、AR和物联网技术集中展示，让参观者亲身体验未来科技的魅力。',
    timestamp: '2024-04-10T09:30:00Z',
    sourceType: 'other',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'],
    tags: ['科技', '创新', 'VR', 'AR', '物联网'],
    authorId: 'user5',
    author: {
      id: 'user5',
      name: '钱七',
      email: 'qianqi@example.com',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    },
    createdAt: '2024-04-05T14:30:00Z',
    updatedAt: '2024-04-05T14:30:00Z'
  },
  {
    id: '6',
    title: '古典音乐节',
    description: '国际知名交响乐团带来贝多芬、莫扎特等经典作品，为观众呈现一场听觉盛宴。',
    timestamp: '2024-04-15T19:30:00Z',
    sourceType: 'other',
    images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800'],
    tags: ['音乐', '古典', '文化', '艺术'],
    authorId: 'user6',
    author: {
      id: 'user6',
      name: '孙八',
      email: 'sunba@example.com',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
    },
    createdAt: '2024-04-10T12:00:00Z',
    updatedAt: '2024-04-10T12:00:00Z'
  }
];

const mockPerspectives: Perspective[] = [
  {
    id: 'p1',
    content: '作为参与者，我认为这次峰会的组织非常出色，特别是AI伦理讨论环节很有启发性。',
    authorId: 'user3',
    author: {
      id: 'user3',
      name: '王五',
      email: 'wangwu@example.com',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'
    },
    eventId: '1',
    createdAt: '2024-03-16T15:00:00Z'
  },
  {
    id: 'p2',
    content: '从媒体角度看，这次峰会的报道覆盖了主流媒体，影响力很大。',
    authorId: 'user4',
    author: {
      id: 'user4',
      name: '赵六',
      email: 'zhaoliu@example.com',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    eventId: '1',
    createdAt: '2024-03-17T09:00:00Z'
  }
];

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // 获取事件列表
  async getEvents(): Promise<Event[]> {
    await delay(500);
    return mockEvents;
  },

  // 创建新事件
  async createEvent(data: CreateEventData): Promise<{ id: string }> {
    await delay(800);
    // 查找最大ID并加1
    const maxId = mockEvents.reduce((max, event) => Math.max(max, parseInt(event.id, 10)), 0);
    const newId = (maxId + 1).toString();
    const newEvent: Event = {
      id: newId,
      ...data,
      authorId: 'current-user',
      author: {
        id: 'current-user',
        name: '当前用户',
        email: 'current@example.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockEvents.push(newEvent);
    return { id: newId };
  },

  // 获取特定事件
  async getEvent(id: string): Promise<{ event: Event; perspectives: Perspective[] }> {
    await delay(600);
    const event = mockEvents.find(e => e.id === id);
    if (!event) {
      throw new Error('Event not found');
    }
    const perspectives = mockPerspectives.filter(p => p.eventId === id);
    return { event, perspectives };
  },

  // 添加视角
  async addPerspective(eventId: string, data: CreatePerspectiveData): Promise<{ id: string }> {
    await delay(700);
    const newId = `p${mockPerspectives.length + 1}`;
    const newPerspective: Perspective = {
      id: newId,
      ...data,
      authorId: 'current-user',
      author: {
        id: 'current-user',
        name: '当前用户',
        email: 'current@example.com'
      },
      eventId,
      createdAt: new Date().toISOString()
    };
    mockPerspectives.push(newPerspective);
    return { id: newId };
  }
};
