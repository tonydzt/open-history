// 对象存储接口定义

// 预签名URL选项
export interface PresignedUrlOptions {
  // 文件唯一标识符
  key: string;
  // 文件类型
  contentType?: string;
  // 过期时间（秒）
  expires?: number;
}

// 预签名URL结果
export interface PresignedUrlResult {
  // 预签名URL
  url: string;
  // HTTP方法
  method: 'PUT' | 'POST' | 'GET';
  // 可选的请求头
  headers?: Record<string, string>;
  // 过期时间
  expiresAt: Date;
}

// 上传结果
export interface UploadResult {
  // 文件URL
  url: string;
  // 文件键（在存储中的标识符）
  key: string;
  // 文件大小
  size: number;
  // 上传时间
  uploadedAt: Date;
}

// Vercel Blob 上传参数
export interface VercelBlobUploadOptions {
  // 文件路径/名称
  pathname: string;
  // 文件访问权限
  access?: 'public' | 'private';
  // 是否添加随机后缀
  addRandomSuffix?: boolean;
  // 允许的文件类型
  allowedContentTypes?: string[];
  // 回调URL
  callbackUrl?: string;
  // token负载
  tokenPayload?: string;
}

// 对象存储接口 - 专注于图片上传功能
export interface StorageProvider {
  // 获取预签名URL（用于客户端直接上传）
  getPresignedUrl(options: PresignedUrlOptions): Promise<PresignedUrlResult>;
}