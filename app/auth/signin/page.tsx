'use client'

import { useState, useEffect } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const errorParam = searchParams.get('error');

  useEffect(() => {
    if (errorParam) {
      setError('登录过程中出现错误，请重试或使用其他登录方式。');
    }
  }, [errorParam]);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
      setLoading(false);
    };

    fetchProviders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-6 py-12">
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-600 hover:bg-primary-500 transition ease-in-out duration-150 cursor-not-allowed">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              加载登录选项...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-12 bg-white shadow-lg rounded-lg">
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">登录 Chronicle</h1>
          <p className="mt-2 text-gray-600">选择以下方式登录或创建账户</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {providers && Object.values(providers).length > 0 ? (
            // 只显示Google登录选项
            Object.values(providers)
              .filter((provider: any) => provider.id === 'google')
              .map((provider: any) => (
                <button
                  key={provider.id}
                  onClick={() => signIn(provider.id, { callbackUrl })}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg width="24" height="24" aria-hidden="true">
                    <image href="/google-color.svg" width="24" height="24" />
                  </svg>
                  继续使用 {provider.name}
                </button>
              ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              加载登录选项失败，请刷新页面重试。
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>登录即表示您同意我们的 <a href="/terms" className="text-primary-600 hover:underline">服务条款</a> 和 <a href="/privacy" className="text-primary-600 hover:underline">隐私政策</a></p>
        </div>
      </div>
    </div>
  );
}