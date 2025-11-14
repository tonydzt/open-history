
export const getCurrentPageUrl = (options?: { headers?: any; pathname?: string }) => {
  // 客户端环境下使用window.location.href
  if (typeof window !== 'undefined') {
    return window.location.href;
  }

  // 服务器环境下需要提供headers和pathname
  if (options?.headers && options?.pathname) {
    const host = options.headers.get('host') || 'localhost:3000';
    const protocol = options.headers.get('x-forwarded-proto') || 'http';
    return `${protocol}://${host}${options.pathname}`;
  }

  // 无法获取URL时返回空字符串
  return '';
};