#!/usr/bin/env node
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 确保log目录存在
const logDir = path.join(__dirname, 'log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 日志文件路径
const logFilePath = path.join(logDir, 'server.log');

// 清空之前的日志或创建新文件
fs.writeFileSync(logFilePath, '');

console.log(`Starting Next.js development server. Logs will be written to ${logFilePath}`);

// 启动Next.js开发服务器并将输出重定向到日志文件
const devServer = exec('npm run dev');

// 将stdout和stderr输出到日志文件和控制台
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

devServer.stdout.on('data', (data) => {
  process.stdout.write(data);
  logStream.write(data);
});

devServer.stderr.on('data', (data) => {
  process.stderr.write(data);
  logStream.write(data);
});

devServer.on('close', (code) => {
  logStream.end();
  console.log(`Development server exited with code ${code}`);
});

// 处理终止信号
process.on('SIGINT', () => {
  logStream.end(() => {
    devServer.kill();
    process.exit();
  });
});