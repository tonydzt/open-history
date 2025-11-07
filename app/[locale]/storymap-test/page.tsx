import StoryMapJS from '@/components/features/storymap/storymapJS';

// Mock 数据，符合 StoryMapJS 组件的数据结构
const mockStoryMapData = {
  storymap: {
    language: 'en',
    map_type: 'osm:standard',
    map_as_image: false,
    slides: [
      {
        type: 'overview',
        date: 'European Cultural Journey',
        text: {
          headline: 'European Historical Cities Tour',
          text: 'Explore five great cities that shaped European history, from the cradle of classical civilization to the center of modern art.'
        },
        location: {
          lat: 48.5,
          lon: 10.0
        },
        zoom: 4
      },
      {
        date: '753 BC',
        text: {
          headline: 'Rome - The Eternal City',
          text: 'Rome is known as the \'Eternal City\' with over 2,500 years of history. From the center of the ancient Roman Empire to the prosperity of the Renaissance, this city witnessed key moments in Western civilization.\n\nMain attractions include: Colosseum, Roman Forum, Pantheon and Trevi Fountain. Rome is also home to the world\'s smallest country - Vatican City.'
        },
        location: {
          lat: 41.9028,
          lon: 12.4964
        },
        zoom: 12
      },
      {
        date: '3rd Century BC',
        text: {
          headline: 'Paris - City of Light',
          text: 'Paris is one of Europe\'s most important cultural and artistic centers, known for its romantic atmosphere, exquisite architecture and world-class museums.\n\nIconic structures include the Eiffel Tower, Notre Dame Cathedral, Louvre Museum and Arc de Triomphe. Paris is also the birthplace of Impressionist art.'
        },
        location: {
          lat: 48.8566,
          lon: 2.3522
        },
        zoom: 12
      },
      {
        date: '43 AD',
        text: {
          headline: 'London - Where Modern Meets Traditional',
          text: 'London is an international metropolis that blends long history with modern innovation. From Roman Londinium to the center of the British Empire, to today\'s global financial hub.\n\nFamous landmarks include Big Ben, Tower of London, Buckingham Palace and British Museum. London\'s West End is a world-renowned theater district.'
        },
        location: {
          lat: 51.5074,
          lon: -0.1278
        },
        zoom: 11
      },
      {
        date: '9th Century',
        text: {
          headline: 'Prague - City of a Hundred Spires',
          text: 'Prague is one of Europe\'s most beautiful cities, known for its well-preserved historic center, Gothic and Baroque architecture.\n\nMain attractions include Prague Castle, Charles Bridge, Old Town Square and the Astronomical Clock. The city is also the hometown of famous writer Franz Kafka.'
        },
        location: {
          lat: 50.0755,
          lon: 14.4378
        },
        zoom: 12
      },
      {
        date: '3000 BC',
        text: {
          headline: 'Athens - Cradle of Western Civilization',
          text: 'Athens is one of the world\'s oldest cities, known as the birthplace of democracy, philosophy and the Olympic Games.\n\nIconic monuments include the Acropolis, Parthenon, Ancient Agora and Temple of Olympian Zeus. Athens has had a profound influence on Western philosophy, art and political thought.'
        },
        location: {
          lat: 37.9838,
          lon: 23.7275
        },
        zoom: 12
      }
    ]
  }
};

export default function StoryMapTest() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        StoryMapJS 演示测试
      </h1>
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-600 mb-6">
          这是一个使用 StoryMapJS 组件的演示页面，展示了欧洲历史城市的旅游路线。
          点击左侧的城市列表可以切换到对应的地图位置和信息。
        </p>
        {/* 引入并使用 StoryMapJS 组件 */}
        <StoryMapJS data={mockStoryMapData} className="w-full" />
      </div>
    </div>
  );
}