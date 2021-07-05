module.exports = {
    extend: '@vuepress/theme-blog',

    additionalPages: [
        {
            path: '/archive/',
            frontmatter: {
                layout: 'Archive'
            }
        }
    ],

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

}