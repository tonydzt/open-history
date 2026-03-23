'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';

// tong注释 ：参考https://nextjs.org/docs/15/app/guides/lazy-loading#skipping-ssr
// TinyMCE使用ssr会有问题，这里参考nextjs官方文档方式，跳过ssr
const EditorClient = dynamic(() => import('@/components/features/editor/TinyMCEEditor').then((mod) => mod.default), {
  ssr: false, // 禁用服务器端渲染
});

export default function App() {
  const editorRef = useRef<any>(null);

  const logContent = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const setContent = () => {
    if (editorRef.current) {
      editorRef.current.setContent('<p><strong>Hello from parent component!</strong></p><p>&nbsp;</p><p>&nbsp;</p><p><em><strong>阿萨法大幅度</strong></em></p>');
    }
  };

  return (
    <>
      <EditorClient ref={editorRef} />
      <div className="mt-4 space-x-2">
        <button onClick={logContent} className="px-4 py-2 bg-blue-500 text-white rounded">
          获取编辑器内容
        </button>
        <button onClick={setContent} className="px-4 py-2 bg-green-500 text-white rounded">
          设置编辑器内容
        </button>
      </div>
    </>
  );
}