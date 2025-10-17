"use client";
import React, { useState } from 'react';
import TimelineComponent from '@/components/features/timeline/TimelineJS';
import { TimelineScale } from '@/db/model/vo/Timeline';

const TimelineTestPage = () => {
  const [initFailed, setInitFailed] = useState(false);

  // Mock数据，符合Timeline类型的格式
  const mockTimelineData = {
    title: {
      text: {
        headline: "测试时间轴",
        text: "这是一个用于测试TimelineJS组件的演示时间轴"
      }
    },
    events: [
      {
        start_date: {
          year: 2023,
          month: 1,
          day: 1
        },
        end_date: {
          year: 2023,
          month: 1,
          day: 5
        },
        text: {
          headline: "事件一",
          text: "这是第一个测试事件的详细描述内容，用于展示时间轴组件的基本功能。"
        },
        media: {
          url: "https://placehold.co/600x400?text=事件1",
          thumbnail: "https://placehold.co/100x100?text=事件1",
          caption: "事件一的图片说明",
          credit: "图片来源"
        },
        group: "测试标签1"
      },
      {
        start_date: {
          year: 2023,
          month: 2,
          day: 10
        },
        end_date: {
          year: 2023,
          month: 2,
          day: 15
        },
        text: {
          headline: "事件二",
          text: "这是第二个测试事件，展示没有图片的情况。"
        },
        group: "测试标签2"
      },
      {
        start_date: {
          year: 2023,
          month: 3,
          day: 20
        },
        end_date: {
          year: 2023,
          month: 3,
          day: 25
        },
        text: {
          headline: "事件三",
          text: "这是第三个测试事件的详细描述内容，用于展示时间轴组件的另一种样式。"
        },
        media: {
          url: "https://placehold.co/600x400?text=事件3",
          thumbnail: "https://placehold.co/100x100?text=事件3",
          caption: "事件三的图片说明",
          credit: "图片来源"
        },
        group: "测试标签3"
      },
      {
        start_date: {
          year: 2023,
          month: 4,
          day: 1
        },
        end_date: {
          year: 2023,
          month: 4,
          day: 10
        },
        text: {
          headline: "事件四",
          text: "这是第四个测试事件，包含了更多的文本内容以测试时间轴的文本显示效果。"
        },
        group: "测试标签4"
      },
      {
        start_date: {
          year: 2023,
          month: 5,
          day: 15
        },
        end_date: {
          year: 2023,
          month: 5,
          day: 20
        },
        text: {
          headline: "事件五",
          text: "这是第五个测试事件，也是最后一个测试事件，用于展示时间轴的完整功能。"
        },
        media: {
          url: "https://placehold.co/600x400?text=事件5",
          thumbnail: "https://placehold.co/100x100?text=事件5",
          caption: "事件五的图片说明",
          credit: "图片来源"
        },
        group: "测试标签5"
      }
    ],
    // tongbug修改：这里用as TimelineScale这种方式，来修复枚举量不对的问题
    scale: 'human' as TimelineScale
  };

  // 重试初始化
  const handleRetry = () => {
    setInitFailed(false);
    // 重新渲染组件将触发重新初始化
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">TimelineJS 组件测试</h1>
          <p className="text-lg text-gray-600">这个页面用于测试 TimelineJS 组件的功能和展示效果</p>
        </div>

        {/* 测试说明 */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">测试说明</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>本页面使用 mock 数据测试 TimelineJS 组件</li>
            <li>数据包含 5 个测试事件，涵盖了不同的展示场景</li>
            <li>组件将尝试初始化 TimelineJS 并展示时间轴</li>
          </ul>
        </div>

        {/* 主内容区域 */}
        <div className="mb-12">
          {initFailed ? (
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2 text-red-700">TimelineJS 初始化失败</h3>
              <p className="text-red-600 mb-4">无法加载 TimelineJS 库或初始化时间轴。</p>
              <button 
                onClick={handleRetry} 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                重试
              </button>
            </div>
          ) : (
            <div className="h-[600px] bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
              <TimelineComponent 
                data={mockTimelineData} 
              />
            </div>
          )}
        </div>

        {/* 页脚信息 */}
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} TimelineJS 组件测试页面</p>
        </div>
      </div>
    </div>
  );
};

export default TimelineTestPage;