// 参考next-intl[https://next-intl.dev/docs/getting-started/app-router]官方文档，引入i18n插件
const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {};
 
module.exports = withNextIntl(nextConfig);
