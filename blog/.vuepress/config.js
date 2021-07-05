module.exports = {
  title: 'Yunerself',
  description: 'Yunerself Blog',

  head: [
    ['link', { rel: 'icon', href: '/yunerself.png' }]
  ],



  theme: '@vuepress/theme-blog',
  themeConfig: {
    logo: '/yunerself.jpg',

    dateFormat: 'YYYY-MM-DD-dd',

    smoothScroll: true,

    pwa: true,

    globalPagination: {
      prevText: '上一页',
      nextText: '下一页',
    },

    sitemap: {
      hostname: 'https://yunerself.com'
    },

    feed: {
      canonical_base: 'https://yunerself.com',
    },

    directories: [
      {
        id: 'blog',
        dirname: '_posts/tech',
        path: '/',
      },
      {
        id: 'book',
        dirname: '_posts/book',
        path: '/book/',
      },
      {
        id: 'diary',
        dirname: '_posts/diary',
        path: '/diary/',
      },
    ],

    nav: [
      {
        text: '归档',
        link: '/archive/',
      },
      {
        text: '标签',
        link: '/tag/',
      },
      {
        text: '书摘',
        link: '/book/',
      },
      {
        text: '随笔',
        link: '/diary/',
      },
    ],

    footer: {
      copyright: [
        {
          text: 'MIT Licensed | Copyright © yunerself.com',
        },
      ],
    },
  },

  plugins: {
    '@vuepress/google-analytics': {
      'ga': process.env.GOOGLE_ANALYTICS_GA // 'UA-00000000-0'
    },
    '@vuepress/pwa': {
      serviceWorker: true,
      popupComponent: 'CustomSWUpdatePopup',
      updatePopup: {
        message: "发现新内容可用",
        buttonText: "刷新"
      }
    }
  }
}
