<template>
  <div>
    <v-card elevation="1" class="hw100 d-flex flex-column" style="padding: 10px">
      <div class="d-flex justify-space-between">
        <div class="d-flex align-center m5l">
          <v-text-field clearable class="m5h" @keydown.native.enter="initCommonList()"
                        v-model="search"
                        append-icon="mdi-magnify" label="搜索" prepend-inner-icon="mdi-book-open-outline"
                        dense hide-details outlined placeholder="输入关键字..."/>
        </div>
        <div>
          <v-btn @click="initCommonList()" icon elevation="0" color="primary" class="m5r" style="margin-top: 2px">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="d-flex flex-column justify-space-between flex-grow-1">
        <el-table ref="table"
                  :data="tableData"
                  highlight-current-row
                  class="w100 flex-grow-1">
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
              label="使用人数"
              align="center"
              prop="uses"
              width="100">
          </el-table-column>
          <el-table-column
              label="单词数量"
              align="center"
              prop="cnt"
              width="100">
          </el-table-column>
          <el-table-column
              label="创建者"
              align="center"
              prop="creatorName"
              width="100">
          </el-table-column>
          <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="180">
          </el-table-column>
          <el-table-column
              label="最后更新"
              align="center"
              prop="updateTime"
              width="180">
          </el-table-column>
          <el-table-column label="操作" width="70"
                           align="center">
            <v-tooltip bottom slot-scope="scope">
              <template v-slot:activator="{ on, attrs }">
                <v-btn :disabled="scope.row.self" icon color="primary" v-bind="attrs" v-on="on"
                       @click="addOrRemove(scope.row)" :loading="scope.row.loading">
                  <v-icon>{{ scope.row.hasLib ? 'mdi-check' : 'mdi-plus' }}</v-icon>
                </v-btn>
              </template>
              <span>{{ scope.row.hasLib ? '从我的库移除' : '添加为我的库' }}</span>
            </v-tooltip>
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
  </div>
</template>

<script>
import * as lib from '@/network/details/lib'
import TableLoading from "@/components/tableLoading";

export default {
  name: "CommonLib",
  data: () => ({
    // 表格数据
    tableData: [],
    search: '',
    //分页相关
    page: {
      size: 10,
      total: 0,
      current: 1
    }
  }),
  created() {
    this.initCommonList()
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
    addOrRemove(row) {
      console.log(JSON.stringify(row))
      let remove = row.hasLib
      row.loading = true
      if (remove) {
        this.dialog.show({
          title: "移除提示",
          type: "warn",
          content: `是否移除词库 <span style="color: red">${row.libName}</span> ?`
        }).onRightClick(() => {
          lib.remove(row.id).then(res => {
            if (res.data === true) {
              row.hasLib = false
              this.snackBar.show("移除成功")
            } else {
              this.snackBar.error("移除失败")
            }
          }).finally(() => {
            row.loading = false
          })
        }).onLeftClick(() => {
          row.loading = false
        }).onOutsideClick(() => {
          row.loading = false
        })

      } else {
        lib.add(row.id).then(res => {
          if (res.data === true) {
            row.hasLib = true
            this.snackBar.show("添加成功")
          } else {
            this.snackBar.error("添加失败")
          }
        }).finally(() => {
          row.loading = false
        })
      }
    },
    initCommonList(pageNum, pageSize) {
      // 分页获取公共库列表
      lib.getListCommon({
        pageNum: pageNum ?? this.page.current,
        pageSize: pageSize ?? this.page.size,
        search: this.search
      }).then(res => {
        res.data.list.forEach(v => {
          v.loading = false
        })
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
      this.initCommonList(this.page.current, undefined)
    },
    /**
     * 分页数量改变事件
     * */
    sizeChange() {
      this.initCommonList(undefined, this.page.size)
    }
  }
}
</script>

<style scoped>

</style>
