![Github Action State: Build](https://github.com/gaodyun/vuepress-blog-yunerself/workflows/Build/badge.svg) ![Github Action State: Deploy](https://github.com/gaodyun/vuepress-blog-yunerself/workflows/Deploy/badge.svg)

# 博客

blog/_posts文件夹：博客文章

# yunerself
yunerself是基于vuepress的静态博客
博客的主题采用了官方的vuepress-theme-blog
基于官方的主题做了以下改动：
- 自定义PWA组件的样式
- 网站title的位置插入了logo
- 修改了主题颜色
- 增加了文章列表页图片的宽度限制
- 添加了归档的功能
- frontmatter没有date字段则使用文件的mtime信息

以下是各个改动的思路，具体的细节和配置可以看代码。
## 自定义PWA组件的样式
代码主要参考了vuepress文档-官方插件-PWA章节，[自定义sw-update-popup的UI](https://v1.vuepress.vuejs.org/plugin/official/plugin-pwa.html#customize-the-ui-of-sw-update-popup)中的样例，然后添加了一些自定义的CSS样式。
## title位置插入logo
### 思路
此处利用的是vuepress提供的[主题继承](https://vuepress.vuejs.org/theme/inheritance.html#inheritance-strategy)功能，先将原有的Header拿过来，然后魔改之。运行的时候，继承机制会将Header替换为魔改的Header。
### 具体操作
- 开启主题继承(此处需要注意，官网中提及的Atomic theme概念和Derived theme概念，已经是通过派生方式构建的主题，就无法再使用主题继承了。这里是基于官方主题进行继承，所以不慌)
```js
// .vuepress/theme/index.js
module.exports = {
  extend: '@vuepress/theme-default'
}
```
- 在.vuepress目录下，参考官方提供的[目录结构](https://vuepress.vuejs.org/theme/writing-a-theme.html)，建文件夹和文件
```js
// 此处的文件结构
.vuepress/theme/components/Header.vue
.vuepress/theme/components/MobileHeader.vue

// 以Header为例
// 新增了img标签
<NavLink link="/" class="home-link">
    <div class="header-wrapper">
        <div>
            <img
                class="logo"
                v-if="$themeConfig.logo"
                :src="$themeConfig.logo"
                alt="logo"
            />
        </div>
        <div class="padding-left-px">
            {{ $site.title }}
        </div>
    </div>
</NavLink>

// 引用Feed组件的时候，不通过相对路径，而是通过@
import Feed from "@parent-theme/components/Feed";

// 样式细节暂且不表，图片主要是对长宽做了限制，避免把标题栏撑大
// title则是控制了一下padding距离，使得logo和title之间稍微有点空间
// logo文件的配置，在.vuepress/config.js中
```
## 修改主题颜色
参考[theme-blog的文档](https://vuepress-theme-blog.ulivz.com/config/palette.html)
```bash
# 新建文件.vuepress/styles/palette.styl
# 修改以下字段，yunerself将颜色代码改成了蓝色，并将亮度调至10%
$accentColor = lighten(#0000FF, 10%)
```
## 列表页图片宽度限制
图片宽度限制的思路同上
```bash
# 新建文件.vuepress/styles/index.styl
# 设置图片的最大宽度为父元素的宽度
.ui-post-summary
  img
    max-width 100%
```
## 归档
此处的思路参考了github的[hirCodd](https://github.com/hirCodd/vuepress-blog)作者，在此对大佬表示感谢。
### 思路
如果归档页面的路径为/archive/，归档页面的组件为Archive，则需要将/archive/添加到页面路由，同时让该路由加载Archive组件。

新增路由的方式，参考[vuepress文档](https://vuepress.vuejs.org/plugin/option-api.html#additionalpages)中的`Add a pure route`部分。

[theme-blog文档](https://vuepress-theme-blog.ulivz.com/#folder-structure)提到，在`.vuepress/components/`目录下的组件都会自动注册为全局组件，所以Archive组件将会放置在该目录。

### 具体操作
```js
// 新增路由
// .vuepress/theme/index.js
module.exports = {
    additionalPages: [
        {
            path: '/archive/',
            frontmatter: {
                layout: 'Archive'
            }
        }
    ],
}

// 新增组件
// .vuepress/components/Archive.vue
// 这里主要的思路就是解析frontmatter.date字段
// 组件使用了对象数据结构，key为date字段中的年份信息，value为属于相同年份的文章列表
// 年份和文章列表都会按照时间前后倒序排列
```
## 没有frontmatter.date字段则使用文件的mtime信息
### 思路
有些文章并没有配置frontmatter.date信息，这时解析出来的时间就是1970年。这里改为读取文件的mtime信息，获取最后一次改动文件内容的时间，并将其作为frontmatter.date。
```js
/**
 * 这里有个点：
 *  页面在显示文章时间的时候，是用的dayjs.utc(date).format()
 *  如果显式配置了date，则不影响展示年月日
 *  
 *  如果没有显式配置，获取文件mtime的时候，获取的是UTC时间，不包含+8的时区换算
 *  此时，如果本地时间1月29日，00时28分修改了文档，则UTC时间还是1月28日，
 *  通过默认的format()方式显式文章时间的时候，就显得不严谨。
 *  因此，此处在获取mtime以后，又通过local()做了+8的时区换算。
 *  并且结合实际设置frontmatter.date的习惯，只保留年到秒的部分
 */
extendPageData($page) {
    const {
        _filePath,           // file's absolute path
        _computed,           // access the client global computed mixins at build time, e.g _computed.$localePath.
        _content,            // file's raw content string
        _strippedContent,    // file's content string without frontmatter
        key,                 // page's unique hash key
        frontmatter,         // page's frontmatter object
        regularPath,         // current page's default link (follow the file hierarchy)
        path,                // current page's real link (use regularPath when permalink does not exist)
    } = $page

    if (!frontmatter.date && _filePath) {
        const fs = require('fs');
        const dayjs = require('dayjs');
        const utc = require('dayjs/plugin/utc');
        dayjs.extend(utc);

        frontmatter.date = dayjs.utc(fs.statSync(_filePath).mtime).local().format().substr(0, 19);
    }
},
```
***PS: 文档链接可能会随着组件版本的更新，有部分出入，请酌情参考***
# 关于CI/CD
## Public Repo
利用Github Action自动build。具体的文件在 ***.github/workflows/*** 目录下。

本项目设置的是`git push`的动作触发`build action`，`build action`结束以后，自动触发`deploy action`。`build action`主要就是执行`yarn install`和`yarn build`，`deploy action`主要是访问自建的部署API，API会从github中下载最新的Artifact，并部署到nginx。

这里，将google-analytics-ga和部署API都作为环境变量配置在github中了，构建的时候会自动获取到。需要注意的是，通过`${{ secrets.GOOGLE_ANALYTICS_GA }}`方式获取参数之前，需要使用`environment: build`语句指定具体的环境。主要原因就是数据维度，设置的时候是选择environment，并添加secrets，所以使用的时候自然也需要先指定environment。

通过
```yml
env:
    GOOGLE_ANALYTICS_GA: ${{ secrets.GOOGLE_ANALYTICS_GA }}
```
设置的环境变量，node中也可以访问到，通过`process.env.GOOGLE_ANALYTICS_GA`的方式即可。

此外，考虑到安全性，建议限制可执行的action。路径：Settings -> Actions -> Allow select actions (输入允许执行的action，逗号分隔，此处添加的是CI/CD脚本中使用的action)。

根据最小权限的原则，修改action中的Workflow permissions，选择Read repository contents permission即可。路径：Settings -> Actions -> Workflow permissions。

## Private Repo
私有仓库理论上，如果不会随意分享项目，一些配置KEY可以写到项目中。为了保持统一，此处仍然通过环境变量获取。配置路径：Settings -> Secrets。

私有仓库，为了有访问artifacts的权限，需要生成Personal access token，操作路径：头像 -> Settings -> Developer settings -> Personal access tokens。此处需要注意的是token拥有scopes的勾选，因为要执行action，所以workflow要勾选。

私有仓库的Actions permissions也和公有仓库有所不同。私有仓库Actions permissions的设置路径：Settings -> Actions -> Actions permissions。推荐选择Allow select actions，并勾选Allow actions created by GitHub。

根据最小权限的原则，修改action中的Workflow permissions，选择Read repository contents permission即可。路径：Settings -> Actions -> Workflow permissions。