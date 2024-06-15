import { globSync } from 'glob';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import matter from 'gray-matter'
import { writeFileEnsureDir } from './utils/fs-utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../');
const blogOutDir = '_blog';

// 读取md文件形成目录
export function getPostsList(base: string): {text: string, link: string}[] {
  // 匹配所有以.md结尾的文件
  const files = globSync('*.md', {
    cwd: path.resolve(root, base)
  });

  return (files || []).map((fileName) => {
    const pth = path.resolve('/', blogOutDir, base, fileName);
    const text = fileName.replace(/\.md$/, '');
    return {
      text,
      link: pth
    }
  });
}

// 读取所有images文件夹下的图片, 得到<图片名, 图片路径>的映射
export function transformImgUrl() {
  const imgs = globSync(['**/*/images/*', `**/images/*`], {
    cwd: root,
    ignore: ['**/node_modules/**', '**/dist/**', '.vitepress']
  });

  const pthMap = new Map<string, string>();
  imgs.forEach((img) => {
    // 空格替换为%20以便vitepress正确解析
    const pth = ('/' + img).replace(/ /g, "%20");
    const imgName = path.basename(img);
    pthMap.set(imgName, pth);
  });
  return pthMap;
}

function replaceMarkdownLinks(mdText: string, imgMap: Map<string, string>): string {
  // 将 ![[图片名]] 替换为 ![图片名](图片路径)
  return mdText.replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
    if (imgMap.has(p1)) {
      return `![${p1}](${imgMap.get(p1)})`;
    }
    return match;
  });
}

export function prebuild(blogDir: string[]) {
  const imgMap = transformImgUrl();
  // 匹配所有以.md结尾的文件
  blogDir.forEach(dir => {
    const files = globSync('*.md', {
      cwd: path.resolve(root, dir)
    });

    files.forEach((fileName) => {
      const pth = path.resolve(root, dir, fileName);
      const outPth = path.resolve(root, blogOutDir, dir, fileName);
      const content = fs.readFileSync(pth, 'utf8');
      const newMdText = replaceMarkdownLinks(content, imgMap);
      writeFileEnsureDir(outPth, newMdText);
    });
  });
}