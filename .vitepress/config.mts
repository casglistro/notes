import { defineConfig } from 'vitepress'
import { getPostsList, prebuild } from './pre-build.mts'

const cate = [
  '编程语言',
  '经典书籍',
  '考研复习',
  '库和框架',
  '算法',
  '杂项'
];

// 对markdown文件进行预编译
prebuild(cate);

const sidebar = cate.map((c) => {
  return {
    text: c,
    items: getPostsList(c),
    collapsed: false
  }
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "王艺钢的笔记",
  description: "王艺钢的复习笔记",
  // 浏览器标签页图标
  head: [['link', { rel: 'icon', href: 'https://avatars.githubusercontent.com/u/95210542?v=4' }]],
  // 被部署时的url base
  base: '/notes/',
  themeConfig: {
    // 顶部导航栏logo
    logo: 'https://avatars.githubusercontent.com/u/95210542?v=4',
    // https://vitepress.dev/reference/default-theme-config

    
    nav: [
      { text: 'Home', link: '/' },
      { text: '主页', link: 'https://github.com/casglistro' }
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/casglistro' }
    ]
  },

  // 是否开启数学公式支持
  markdown: {
    math: true
  },

  // md文件被预编译了一份到_blog目录下, 所以编译时只需要编译_blog目录下的md文件, 排除原目录
  srcExclude: [
    ...cate.map(c => `./${c}/*.md`)
  ]
});
