import path from "path";
import fs from "fs";

export function writeFileEnsureDir(filePath: string, data: string) {
  const dir = path.dirname(filePath);

  // 检查并创建目录
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
  }

  // 写入文件
  fs.writeFileSync(filePath, data, 'utf8');
}