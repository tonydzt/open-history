'use client';

import { useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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
            Object.values(providers).map((provider: any) => (
              <div key={provider.id}>
                {provider.id === 'credentials' ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const username = e.currentTarget.username.value;
                      if (username) {
                        signIn(provider.id, { username, callbackUrl });
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        用户名
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="请输入用户名进行开发登录"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      {provider.name}
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => signIn(provider.id, { callbackUrl })}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {provider.id === 'github' && (
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    )}
                    {provider.id === 'google' && (
                      <svg width="24" height="24" aria-hidden="true">
                        <image href="/google-color.svg" width="24" height="24" />
                      </svg>
                    )}
                    继续使用 {provider.name}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              加载登录选项失败，请刷新页面重试。
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>登录即表示您同意我们的 <a href="#" className="text-primary-600 hover:underline">服务条款</a> 和 <a href="#" className="text-primary-600 hover:underline">隐私政策</a></p>
        </div>
      </div>
    </div>
  );
}