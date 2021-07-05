<template>
  <div>
    <div class="content default">
      <div class="content-top">目前共计 {{ archiveCount }} 篇日志!</div>
      <div class="content-top">🤔Keep Thinking &amp; ✍Keep Writing</div>
      <div class="block">
        <el-collapse v-model="activeYear" accordion>
          <el-collapse-item
            v-for="(item, index) in Object.keys(archiveListObject)
              .sort()
              .reverse()"
            :name="String(item)"
          >
            <template slot="title">
              {{ item }}年: {{ archiveListObject[item].length }} 篇
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="item in archiveListObject[item]"
                placement="top"
                :timestamp="resolvePostDate(item.frontmatter.date)"
              >
                <p class="article-title">
                  <router-link
                    style="text-decoration: none"
                    :to="item.regularPath"
                  >
                    {{ item.title }}
                  </router-link>
                </p>
              </el-timeline-item>
            </el-timeline>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import dayjsPluginUTC from "dayjs/plugin/utc";

dayjs.extend(dayjsPluginUTC);

export default {
  name: "Archive",
  // props: {
  //   pages: {
  //     type: Array,
  //     default: []
  //   }
  // },
  data() {
    return {
      activeYear: String(new Date().getFullYear()),
      archiveListObject: {},
      archiveCount: 0,
    };
  },
  mounted: function () {
    this.initArchiveListObj();
  },
  methods: {
    /**
     * @description: select post=true
     * @param {type}
     * @return:
     */
    initArchiveListObj() {
      this.$site.pages.forEach((element) => {
        if (element.frontmatter.layout === "Post") {
          let articleDate = dayjs
            .utc(element.frontmatter.date)
            .format(this.$themeConfig.dateFormat || "YYYY-MM-DD-dd");
          let articleYear = parseInt(articleDate.split("-")[0]);

          let currentYearList = this.archiveListObject[articleYear] || [];
          currentYearList.push(element);
          this.archiveListObject[articleYear] = currentYearList;

          this.archiveCount++;
        }
      });

      Object.values(this.archiveListObject).forEach((archiveList) => {
        archiveList.sort((articleA, articleB) => {
          let dateA = dayjs(articleA.frontmatter.date).valueOf();
          let dateB = dayjs(articleB.frontmatter.date).valueOf();

          return dateB - dateA;
        });
      });
    },

    resolvePostDate(date) {
      return dayjs
        .utc(date)
        .format(this.$themeConfig.dateFormat || "YYYY-MM-DD-dd");
    },
  },
};
</script>
<style lang="stylus">
.content>.content-top {
  margin: 5px 0 15px 0px;
  font-size: 18px;
  font-weight: 600;
}

.el-margin-top {
  margin-top: 5px;
}

.el-timeline-item__content > .el-card > .el-card__body {
  text-align: left;
}

.el-timeline-item__content {
  .article-title a {
    font-size: 16px;
    font-weight: 500;
  }
}

/* .archives-tag > .article-tag > .el-tag {
  margin-left: 5px;
} */
.span-tag {
  margin-left: 0.5rem;
}
</style>