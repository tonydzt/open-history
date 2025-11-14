// 参考next-intl[https://next-intl.dev/docs/getting-started/app-router]官方文档，引入i18n插件
const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    // tongbug修改: 配置安全访问的图片域名(不配置的话，访问google头像这种外站图片可能会报net::ERR_BLOCKED_BY_ORB)：https://nextjs.org/docs/app/getting-started/images?utm_source=chatgpt.com#remote-images
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ]
  },

  // tongbug修改: 这里如果不配置这个，那么开发环境默认走的严格模式，useEffect会执行两次，导致一些问题
  reactStrictMode: false,
};
 
module.exports = withNextIntl(nextConfig);
