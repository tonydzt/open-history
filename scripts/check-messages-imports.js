// 检查是否所有的message下的国际化文件都被requests.js文件导出了

const fs = require('fs');
const path = require('path');

// 定义目录路径
const messagesDir = '/Users/douzhitong/project/own/open-history/i18n/messages';
const requestFilePath = '/Users/douzhitong/project/own/open-history/i18n/request.ts';

// 读取messages目录下的所有JSON文件
function getAllMessageFiles() {
  const messageFiles = [];
  
  // 遍历目录结构
  const traverseDir = (dir, baseDir = '') => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativePath = path.join(baseDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        traverseDir(fullPath, relativePath);
      } else if (file.endsWith('.json') && (file.endsWith('.en.json') || file.endsWith('.zh.json'))) {
        // 移除语言后缀，用于比较
        const baseName = file.replace(/\.(en|zh)\.json$/, '');
        const namespace = path.join(relativePath, baseName).replace(/\//g, '.');
        messageFiles.push({
          fullPath,
          relativePath: path.join(relativePath, file),
          baseName,
          namespace
        });
      }
    });
  };
  
  traverseDir(messagesDir);
  return messageFiles;
}

// 从request.ts文件中提取已导入的文件
function getImportedFiles() {
  const content = fs.readFileSync(requestFilePath, 'utf8');
  const importRegex = /import\(\`\.\/messages\/(.*?)\.\$\{locale\}\.json\`\)/g;
  const importedFiles = [];
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    importedFiles.push(match[1]);
  }
  
  return importedFiles;
}

// 检查并报告结果
function checkImports() {
  console.log('====================================');
  console.log('检查i18n翻译文件导入情况');
  console.log('====================================');
  
  // 获取所有消息文件和已导入的文件
  const allMessageFiles = getAllMessageFiles();
  const importedFiles = getImportedFiles();
  
  // 按目录分组统计
  const directoryStats = {};
  
  // 去重处理 - 获取唯一的基础文件名（不包含语言后缀）
  const uniqueFiles = [];
  const seen = new Set();
  
  allMessageFiles.forEach(file => {
    const basePath = file.relativePath.replace(/\.(en|zh)\.json$/, '');
    if (!seen.has(basePath)) {
      seen.add(basePath);
      uniqueFiles.push({
        basePath,
        fullPath: file.fullPath.replace(/\.(en|zh)\.json$/, ''),
        namespace: file.namespace
      });
      
      // 更新目录统计
      const dirName = path.dirname(basePath);
      if (!directoryStats[dirName]) {
        directoryStats[dirName] = { total: 0, imported: 0 };
      }
      directoryStats[dirName].total++;
    }
  });
  
  // 检查哪些文件已导入，哪些未导入
  const importedList = [];
  const notImportedList = [];
  
  uniqueFiles.forEach(file => {
    const importPath = file.basePath.replace(/\\/g, '/'); // 确保路径格式一致
    const isImported = importedFiles.some(imported => 
      imported === importPath || 
      imported === path.join(path.dirname(importPath), path.basename(importPath))
    );
    
    if (isImported) {
      importedList.push(file);
      const dirName = path.dirname(file.basePath);
      if (directoryStats[dirName]) {
        directoryStats[dirName].imported++;
      }
    } else {
      notImportedList.push(file);
    }
  });
  
  // 输出统计信息
  console.log(`\n总翻译文件数: ${uniqueFiles.length}`);
  console.log(`已导入文件数: ${importedList.length}`);
  console.log(`未导入文件数: ${notImportedList.length}`);
  
  // 输出目录统计
  console.log('\n目录统计:');
  Object.entries(directoryStats).forEach(([dir, stats]) => {
    console.log(`  ${dir}: ${stats.imported}/${stats.total} 已导入`);
  });
  
  // 输出未导入的文件列表
  if (notImportedList.length > 0) {
    console.log('\n未导入的翻译文件:');
    notImportedList.forEach(file => {
      console.log(`  - ${file.basePath}`);
    });
    
    // 生成修复建议
    console.log('\n修复建议: 在request.ts中添加以下导入:');
    console.log('\n// 在数组中添加以下变量名:');
    notImportedList.forEach((file, index) => {
      const varName = file.basePath
        .split('/')
        .map(part => part.charAt(0).toLowerCase() + part.slice(1))
        .join('');
      console.log(`    ${varName}${index < notImportedList.length - 1 ? ',' : ''}`);
    });
    
    console.log('\n// 在Promise.all中添加以下导入语句:');
    notImportedList.forEach((file, index) => {
      console.log(`    import(\`./messages/${file.basePath}.\${locale}.json\`)${index < notImportedList.length - 1 ? ',' : ''}`);
    });
    
    console.log('\n// 在messages对象中添加以下展开语句:');
    notImportedList.forEach((file, index) => {
      const varName = file.basePath
        .split('/')
        .map(part => part.charAt(0).toLowerCase() + part.slice(1))
        .join('');
      console.log(`      ...${varName}.default${index < notImportedList.length - 1 ? ',' : ''}`);
    });
  } else {
    console.log('\n✓ 所有翻译文件都已正确导入!');
  }
  
  console.log('\n====================================');
}

// 运行检查
checkImports();