import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

function getSidebarItems(dir) {
  const fullPath = path.resolve(process.cwd(), dir)

  function walkDir(currentPath, basePath = '') {
    const items = []
    const files = fs.readdirSync(currentPath)

    files.forEach(file => {
      const filePath = path.join(currentPath, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        items.push({
          text: file,
          collapsible: true,
          items: walkDir(filePath, path.join(basePath, file))
        })
      } else if (file.endsWith('.md')) {
        const name = file.replace('.md', '')
        const linkPath = `/${path.join('articles/Tutorial', basePath, name).replace(/\\/g, '/')}` // 不包含 docs
        items.push({ text: name, link: linkPath })
      }
    })

    return items
  }

  return walkDir(fullPath)
}

export default defineConfig({
  base: '/', // 确保 base 配置正确
  title: "Neat科技",
  description: "A VitePress Site",
  head: [
    // 添加 favicon 的配置，确保路径正确
    ['link', { rel: 'icon', href: '/icons/my-icon.png' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: getSidebarItems('docs/articles/Tutorial') // 动态生成
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    search: {
      provider: 'local'
    }
  },

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '示例', link: '/markdown-examples' }
        ],
        sidebar: [
          {
            text: '部署相关笔记',
            items: getSidebarItems('docs/articles/Tutorial') // 动态生成
          }
        ]
      }
    },
  },
})
