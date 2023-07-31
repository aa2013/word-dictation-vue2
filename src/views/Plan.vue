<template>
  <div>
    <v-card elevation="1" class="hw100" style="padding: 10px">
      <div class="d-flex justify-space-between">
        <div class="d-flex align-center m5l">
          <v-text-field clearable class="m5h" @keydown.enter="initList()"
                        v-model="search"
                        append-icon="mdi-magnify" prepend-inner-icon="mdi-lightbulb-on-outline"
                        dense hide-details outlined placeholder="输入关键字..." label="搜索"/>
        </div>
        <div>
          <v-btn @click="initList()" icon elevation="0" color="primary" class="m5r" style="margin-top: 2px">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="d-flex flex-column justify-space-between" style="height: 100%">
        <el-table ref="table"
                  :data="tableData"
                  highlight-current-row
                  style="width: 100%">
          <el-table-column
              label="id"
              prop="id"
              align="center"
              width="50">
          </el-table-column>
          <el-table-column
              label="库名"
              align="center"
              prop="libName"
              min-width="150">
          </el-table-column>
          <el-table-column
              label="方案名"
              align="center"
              prop="name"
              min-width="150">
          </el-table-column>
          <el-table-column
              label="乱序"
              align="center"
              width="100">
            <template slot-scope="scope">
              <v-icon color="primary">
                {{ scope.row.disorder ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
            </template>
          </el-table-column>
          <el-table-column
              label="中译英"
              align="center"
              prop="ch2en"
              width="100">
            <template slot-scope="scope">
              <v-icon color="primary">
                {{ scope.row.ch2en ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
            </template>
          </el-table-column>
          <el-table-column
              label="重复次数"
              align="center"
              prop="repeat"
              width="100">
          </el-table-column>
          <el-table-column
              label="单词数量"
              align="center"
              prop="cnt"
              width="100">
          </el-table-column>
          <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="180">
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon color="primary" v-bind="attrs" v-on="on"
                         @click="showPrintDialog(scope.row)" :loading="scope.row.previewLoading">
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                </template>
                <span>打印</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn :disabled="scope.row.self" icon color="red" v-bind="attrs" v-on="on"
                         @click="removePlan(scope.row)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>删除此方案</span>
              </v-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 10px"
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="page.current"
            :page-sizes="[10,20,30,40]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
        </el-pagination>
      </div>
    </v-card>
    <print-preview-dialog v-model="previewData" :print-word-list="printWordList"/>
  </div>
</template>

<script>
import * as plan from '@/network/details/plan'
import TableLoading from "@/components/tableLoading";
// 单词显示打印组件
import PrintPreviewDialog from "@/components/common/PrintPreviewDialog.vue";

export default {
  name: "Plan",
  components: {PrintPreviewDialog},
  data: () => ({
    // 表格数据
    tableData: [],
    search: '',
    //分页相关
    page: {
      size: 10,
      total: 0,
      current: 1
    },
    printWordList: [],
    previewData: {
      show: false,
      ch2en: false,
      repeat: 1,
      random: false
    },
  }),
  created() {
    this.initList()
  },
  mounted() {
    // 页面载入后设置表格加载条
    let table = this.$refs['table']
    let header = table.$el.getElementsByClassName('el-table__header-wrapper')[0]
    let container = document.createElement('div')
    this.tableLoading = TableLoading.init(container)
    header.appendChild(container)
    this.tableLoading.show()
  },
  methods: {
    removePlan(row) {
      this.dialog.show({
        title: "删除提示",
        content: `是否删除 <span><strong>${row.name}</strong></span> 方案`,
        type: "warn"
      }).onRightClick(() => {
        plan.remove(row.id).then(res => {
          if (res.data === true) {
            this.snackBar.show("删除成功")
            this.initList()
          } else {
            this.snackBar.show({
              text: "删除成功",
              color: "red"
            })
          }
        }).catch(err => {
          this.snackBar.show({
            text: err.desc,
            color: "red"
          })
        })
      })
    },
    showPrintDialog(row) {
      row.previewLoading = true
      this.previewData = {
        show: false,
        ch2en: row.ch2en,
        repeat: row.repeat,
        random: row.disorder
      }
      setTimeout(() => {
        this.getWords(row, row.id)
      }, 50)
    },
    getWords(row, planId) {
      this.printWordList = []
      plan.getWords(planId).then(res => {
        this.printWordList = res.data.map(item => ({
          word: item.word,
          explain: {
            explanation: item.explain
          }
        }))
        this.previewData.show = true
      }).finally(() => {
        row.previewLoading = false
      })
    },
    initList(pageNum, pageSize) {
      // 分页获取公共库列表
      plan.getList({
        pageNum: pageNum ?? this.page.current,
        pageSize: pageSize ?? this.page.size,
        search: this.search
      }).then(res => {
        res.data.list.forEach(item => item.previewLoading = false)
        this.tableData = res.data.list
        this.page.total = res.data.total
      }).finally(() => {
        // 关闭表格加载条
        this.tableLoading.close()
      })
    },
    /**
     * 分页改变事件
     * */
    currentChange() {
      this.initList(this.page.current, undefined)
    },
    /**
     * 分页数量改变事件
     * */
    sizeChange() {
      this.initList(undefined, this.page.size)
    }
  }
}
</script>

<style scoped>

</style>
