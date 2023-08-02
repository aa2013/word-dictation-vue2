<template>
  <div>
    <!--    主表格-->
    <v-card elevation="1" class="hw100 d-flex flex-column justify-space-between" style="padding: 10px">
      <div style="margin-bottom: 10px" class="d-flex justify-space-between overflow-x-auto scroll-bar">
        <div class="d-flex align-center" style="min-width: 500px">
          <v-btn icon color="primary" class="m5r" @click="gotoMyLib">
            <v-icon>mdi-arrow-left-top</v-icon>
          </v-btn>
          <span>词库：{{ lib.libName }}</span>
          <v-text-field clearable class="m5h" v-model="search" @keydown.enter="searchWord"
                        label="搜索" prepend-inner-icon="mdi-alphabetical"
                        append-icon="mdi-magnify"
                        dense hide-details outlined placeholder="输入单词..."/>
          <v-btn elevation="0" color="primary" style="margin-top: 2px" @click="importDialog.show=true">
            导入
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <div class="p10l" style="min-width: 170px">
          已选：{{ getSelectItemsLen }}
          <v-btn @click="randomDialog.show=true" icon color="primary">
            <v-icon>mdi-repeat</v-icon>
          </v-btn>
          <v-btn color="primary" outlined small @click="previewDialog.show=true">生成</v-btn>
        </div>
      </div>
      <div class="w100 d-flex flex-column overflow-hidden flex-grow-1">
        <el-table ref="table"
                  height="100%"
                  :data="tableData"
                  highlight-current-row
                  @row-click="selectRow"
                  :row-key="getTableRowKey"
                  @selection-change="selectionChange"
                  style="width: 100%">
          <el-table-column
              align="center"
              type="selection"
              :reserve-selection="true"
              width="50">
          </el-table-column>
          <el-table-column
              label="id"
              prop="id"
              align="center"
              width="50">
          </el-table-column>
          <el-table-column
              show-tooltip-when-overflow
              label="单词"
              align="center"
              prop="word"
              min-width="150">
          </el-table-column>
          <el-table-column
              show-tooltip-when-overflow
              label="释义"
              align="center"
              min-width="100">
            <div slot-scope="scope">
              {{ generateExplain(scope.row) }}
            </div>
          </el-table-column>
          <el-table-column
              label="美式音标"
              align="center"
              prop="usSymbol"
              width="200">
            <div slot-scope="scope">
              {{ scope.row['usSymbol'] === '' ? '——' : scope.row['usSymbol'] }}
              <v-tooltip bottom v-if="scope.row['usSymbolMp3']">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click.stop="playAudio(scope.row['usSymbolMp3'])" small icon color="primary"
                         v-bind="attrs"
                         v-on="on">
                    <v-icon>mdi-volume-high</v-icon>
                  </v-btn>
                </template>
                <span>播放</span>
              </v-tooltip>
            </div>
          </el-table-column>
          <el-table-column
              label="英式音标"
              align="center"
              width="200">
            <div slot-scope="scope">
              {{ scope.row['enSymbol'] === '' ? '——' : scope.row['enSymbol'] }}
              <v-tooltip bottom v-if="scope.row['enSymbolMp3']">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click.stop="playAudio(scope.row['enSymbolMp3'])" small icon color="primary"
                         v-bind="attrs"
                         v-on="on">
                    <v-icon>mdi-volume-high</v-icon>
                  </v-btn>
                </template>
                <span>播放</span>
              </v-tooltip>
            </div>
          </el-table-column>
          <el-table-column label="操作" width="150"
                           align="center">
            <div slot-scope="scope">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click.stop="showDetailDialog(scope.row)" icon color="primary" v-bind="attrs"
                         v-on="on">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <span>查看</span>
              </v-tooltip>
              <v-tooltip bottom v-if="lib.self">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click.stop="" icon color="red" v-bind="attrs" v-on="on">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>删除</span>
              </v-tooltip>
            </div>
          </el-table-column>
        </el-table>
        <div class="w100 overflow-x-auto">
          <el-pagination
              style="margin-top: 10px"
              @size-change="sizeChange"
              @current-change="currentChange"
              :current-page="page.current"
              :page-sizes="[10,20,50,100,200]"
              :page-size="page.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total">
          </el-pagination>
        </div>
      </div>
    </v-card>
    <!--    预览弹窗-->
    <print-preview-dialog v-model="previewDialog" :print-word-list="selectItems"
                          @showPlanDialog="showPlanDialog" show-plan-btn/>
    <!--    导入弹窗-->
    <v-dialog v-model="importDialog.show" scrollable persistent width="350">
      <v-card>
        <v-card-title class="text-h5">
          单词导入
        </v-card-title>
        <div class="p10h overflow-auto scroll-bar" style="height: 300px;">
          <v-textarea rows="10" v-model="importDialog.content"
                      v-show="!importDialog.previewShow" class="scroll-bar"
                      label="一行一个" hide-details/>
          <div v-show="importDialog.previewShow" class="text-center">
            <img v-show="importDialog.words.length===0" width="200" height="200"
                 src="../../assets/img/no_result.png"/>
            <div v-show="importDialog.words.length!==0" v-ripple
                 v-for="(item,i) in importDialog.words" :key="i"
                 class="preview-word-card d-flex non-select">
              <div style="width: 40px;border-right: #eee 1px solid">{{ i + 1 }}</div>
              <div class="flex-grow-1 p10l" style="text-align: left">{{ item.value }}</div>
              <div style="width: 40px">
                <v-icon v-show="item.status==='wait'" color="blue">
                  mdi-upload-outline
                </v-icon>
                <v-icon v-show="item.status==='ok'" color="primary">
                  mdi-check
                </v-icon>
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-show="item.status==='failed'" color="red" v-bind="attrs" v-on="on">
                      mdi-alert-circle-outline
                    </v-icon>
                  </template>
                  <span>{{ importDialog.failedText }}</span>
                </v-tooltip>
                <v-btn icon loading v-show="item.status==='uploading'"
                       color="info"/>
              </div>
            </div>
          </div>
        </div>
        <v-card-actions>
          <v-btn
              color="green darken-1"
              text
              v-show="importDialog.previewShow"
              @click="importDialog.previewShow = false">
            编辑
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="closeImportDialog">
            取消
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              :loading="importDialog.loading"
              @click="importDialogSubmit">
            {{ importDialog.previewShow ? "导入" : "预览" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    随机选择弹窗-->
    <v-dialog v-model="randomDialog.show" scrollable persistent width="350">
      <v-card>
        <v-card-title class="text-h5">
          随机选择
        </v-card-title>
        <div class="p10">
          <v-text-field hide-details outlined label="设置数量" v-model="randomDialog.num"/>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="randomDialog.show=false">
            取消
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="randomGet">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    详情查看弹窗-->
    <v-dialog v-model="detailDialog.show" scrollable width="420">
      <v-card>
        <v-card-title class="text-h5">
          详情
        </v-card-title>
        <v-card-text style="padding: 20px" class="scroll-bar">
          <h2 class="m5b">{{ detailDialog.detail['word'] }}</h2>
          <span>英式音标：[{{ detailDialog.detail['enSymbol'] }}]</span>
          <v-tooltip class="m5h" bottom v-if="detailDialog.detail['enSymbolMp3']">
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click.stop="playAudio(detailDialog.detail['enSymbolMp3'])" small icon
                     color="primary"
                     v-bind="attrs"
                     v-on="on">
                <v-icon>mdi-volume-high</v-icon>
              </v-btn>
            </template>
            <span>播放</span>
          </v-tooltip>
          <span>美式音标：[{{ detailDialog.detail['usSymbol'] }}]</span>
          <v-tooltip bottom v-if="detailDialog.detail['usSymbolMp3']">
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click.stop="playAudio(detailDialog.detail['usSymbolMp3'])" small icon
                     color="primary"
                     v-bind="attrs"
                     v-on="on">
                <v-icon>mdi-volume-high</v-icon>
              </v-btn>
            </template>
            <span>播放</span>
          </v-tooltip>
          <div class="m10t" style="padding:20px">
            <div v-for="(item,i) in detailDialog.explains" :key="i" class="d-flex m5b explain" v-ripple>
              <div @click="changeDefaultExplain(i)" class="flex-grow-1 overflow-hidden">
                {{ item['type'] + item['explanation'] }}
              </div>
              <div v-if="item.isDefault===true" style="min-width: 40px" class="d-flex">
                <span style="color: dodgerblue">默认</span>
                <v-icon color="blue" v-if="!hasCustomDefaultExplain()">
                  mdi-check
                </v-icon>
              </div>
              <div v-if="hasCustomDefaultExplain() && item.customDefault" style="width: 40px">
                <v-icon color="blue">
                  mdi-check
                </v-icon>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--    方案保存弹窗-->
    <v-dialog v-model="planDialog.show" width="320">
      <v-card>
        <v-card-title class="text-h5">
          保存此方案
        </v-card-title>
        <v-card-text style="padding: 20px" class="scroll-bar">
          <v-text-field outlined dense hide-details class="m5b"
                        label="起一个名字" v-model="planDialog.name"/>
          方案保存后不支持修改
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text color="green" @click="planDialog.show=false">取消</v-btn>
          <v-btn text color="green" :loading="planDialog.loading" @click="addPlan">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as word from '@/network/details/word'
import * as plan from '@/network/details/plan'
// 表格加载条
import TableLoading from "@/components/tableLoading";
// 单词显示打印组件
import PrintPreviewDialog from "@/components/common/PrintPreviewDialog.vue";
import * as lib from "@/network/details/lib";

export default {
  name: "DetailLib",
  components: {
    PrintPreviewDialog
  },
  props: {
    id: null
  },
  data: () => ({
    lib: {},
    // 表格选择的项
    selectItems: [],
    // 表格数据
    tableData: [],
    // 分页相关
    page: {
      size: 10,
      total: 0,
      current: 1
    },
    // 打印预览弹窗相关
    previewDialog: {
      show: false,
      ch2en: false,
      repeat: 1,
      random: false
    },
    // 导入弹窗相关
    importDialog: {
      show: false,
      previewShow: false,
      content: "",
      words: [],
      loading: false,
      cancel: false,
      failedText: ''
    },
    // 随机弹窗相关
    randomDialog: {
      show: false,
      num: null,
    },
    // 搜索框内容
    search: null,
    //详情弹窗
    detailDialog: {
      show: false,
      detail: {},
      explains: []
    },
    //方案保存弹窗
    planDialog: {
      show: false,
      name: '',
      loading: false
    }
  }),
  computed: {
    // 表格选择项的数量
    getSelectItemsLen() {
      if (this.selectItems) {
        return this.selectItems.length
      }
      return 0
    },
  },
  watch: {
    // 监听路由变化
    $route() {
      if (this.id) {
        this.getLibInfo()
        this.getWordList()
      }
    },
    // 监听导入弹窗编辑框内容变化
    "importDialog.content"(val) {
      // 去除所有的换行
      this.importDialog.words = val.split("\n")
          // 过滤并忽略空字符串的行
          .filter(v => {
            // 去除头尾空格然后判断是否为空字符串
            return v.trim().length !== 0
          })
          // 将所有的单词提取出来，并设置上传状态为等待
          .map(v => ({
            value: v.trim(),
            status: 'wait'
          }))
    }
  },
  mounted() {
    // 页面加载好后给表格插入加载条组件
    let table = this.$refs['table']
    let header = table.$el.getElementsByClassName('el-table__header-wrapper')[0]
    let container = document.createElement('div')
    this.tableLoading = TableLoading.init(container)
    header.appendChild(container)
    if (this.id) {
      this.getLibInfo()
      this.getWordList()
    }
  },
  methods: {
    gotoMyLib() {
      this.$router.push("/my-lib")
    },
    addPlan() {
      this.planDialog.loading = true
      let data = {
        name: this.planDialog.name,
        libId: this.id,
        disorder: this.previewDialog.random,
        repeat: this.previewDialog.repeat,
        ch2en: this.previewDialog.ch2en,
        words: this.selectItems.map(item => {
          return {
            word: item.word,
            explain: item.explain.explanation
          }
        })
      }
      plan.add(data).then(res => {
        if (res.data === true) {
          this.snackBar.show("保存成功")
          this.planDialog.show = false
        } else {
          this.snackBar.show({
            color: "red",
            text: "保存失败"
          })
        }
      }).catch(err => {
        this.snackBar.show({
          color: "red",
          text: err.desc
        })
      }).finally(() => {
        this.planDialog.loading = false
      })
    },
    showPlanDialog() {
      if (this.selectItems.length === 0) {
        this.snackBar.show({
          color: "red",
          text: "请先选择单词"
        })
        return
      }
      this.planDialog.name = ''
      this.planDialog.show = true
    },
    hasCustomDefaultExplain() {
      let explains = this.detailDialog.explains;
      for (let i = 0; i < explains.length; i++) {
        let explain = explains[i];
        if (explain.customDefault)
          return true
      }
      return false
    },
    changeDefaultExplain(i) {
      let explain = this.detailDialog.explains[i]
      word.changeDefaultExplain({
        wordId: explain.wordId,
        defaultId: explain.id,
        libId: this.id
      }).then(res => {
        if (res.data === true) {
          this.detailDialog.detail.explain = explain
          this.detailDialog.explains.forEach((item, j) => {
            item.customDefault = j === i;
          })
        }
      })
    },
    showDetailDialog(row) {
      this.detailDialog.detail = row
      this.detailDialog.show = true
      word.getExplains({
        wordId: row.id,
        libId: this.id
      }).then(res => {
        this.detailDialog.explains = res.data
      })
    },
    /**
     * 随机获取单词数量
     * */
    randomGet() {
      word.getRandomWordList({
        libId: this.id,
        size: this.randomDialog.num
      }).then(res => {
        this.randomDialog.show = false
        let data = res.data
        this.selectItems = data.list
        this.previewDialog.show = true
        this.randomDialog.num = null
      })
    },
    /**
     * 播放音频
     * @param url 音频 url
     * */
    playAudio(url) {
      if (!url)
        return
      let audio = new Audio(url)
      audio.play()
    },
    /**
     * 将单词id设置当做表格行的键
     * */
    getTableRowKey(row) {
      return row.id
    },
    /**
     * 搜索
     * */
    searchWord() {
      this.getWordList(this.search)
    },
    /**
     * 关闭导入弹窗
     * */
    closeImportDialog() {
      this.importDialog.show = false
      this.importDialog.content = ''
      this.importDialog.previewShow = false
      this.importDialog.loading = false;
      this.importDialog.cancel = true
    },
    /**
     * 将待导入的单词按顺序提交，async标记为异步
     * */
    async importDialogSubmit() {
      if (!this.importDialog.previewShow) {
        this.importDialog.previewShow = true
        return
      }
      this.importDialog.cancel = false
      let words = this.importDialog.words
      if (words.length === 0) {
        this.snackBar.error("单词列表不能为空")
      }
      this.importDialog.loading = true;
      let hasFailed = false;
      for (let i = 0; i < words.length; i++) {
        if (this.importDialog.cancel === true) {
          this.getWordList()
          return
        }
        let single = words[i]
        single.status = "uploading"
        //此处等待一个个上传提交导入
        await word.importSingle({
          libId: this.id,
          word: single.value
        }).then(res => {
          single.status = "ok"
        }).catch(err => {
          // 导入失败设置失败原因
          this.importDialog.failedText = err.desc
          single.status = "failed"
          hasFailed = true;
        })
      }
      this.snackBar.show("导入成功")
      if (!hasFailed) {
        this.closeImportDialog()
      } else {
        this.importDialog.loading = false;
      }
      this.getWordList()
    },
    /**
     * 表格选择行事件
     * @param row 被选中的行
     * */
    selectRow(row) {
      this.$refs['table'].toggleRowSelection(row)
    },
    /**
     * 表格选中项改变事件
     * @param rows 新选中的行
     * */
    selectionChange(rows) {
      this.selectItems = rows
    },
    /**
     * 分页选择事件
     * @param cur 新选择的分页
     * */
    currentChange(cur) {
      this.getWordList(null, cur, undefined)
    },
    /**
     * 分页页数量改变时间
     * @param size 新选择的分页大小
     * */
    sizeChange(size) {
      this.getWordList(null, undefined, size)
    },
    getLibInfo() {
      lib.getLibInfo(this.id).then(res => {
        this.lib = res.data
      })
    },
    /**
     * 获取分页单词列表并设置到表格中
     * @param w 单词，搜索时用
     * @param current 第 n 页
     * @param size 第 n 页的大小
     * */
    getWordList(w, current, size) {
      // 显示表格加载条
      this.tableLoading.show()
      word.getWordList({
        libId: this.id,
        word: w,
        pageNum: current ?? this.page.current,
        pageSize: size ?? this.page.size
      }).then(res => {
        this.tableData = res.data.list
        this.page.total = res.data.total
        // 关闭表格加载条
        this.tableLoading.close()
      })
    },
    /**
     * 封装释义显示内容
     * @param row 表格当前行
     * */
    generateExplain(row) {
      let explains = row.explain;
      let type = explains['type'].replace(".", '')
      let explanation = explains['explanation']
      return `${type}. ${explanation}`
    }
  }
}
</script>

<style>
.explain {
  border: 1px #eee solid;
  transition: all 0.3s linear;
  border-radius: 5px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  padding: 0 5px;
  text-align: center;
}

.explain:hover {
  border-color: #1485FE;
  transform: scale(1.01);
}

.preview-word-card {
  border: 1px #eee solid;
  transition: all 0.3s linear;
  border-radius: 5px;
  margin-bottom: 5px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  padding: 0 5px;
  text-align: center;
}

.preview-word-card:hover {
  border-color: #1485FE;
  transform: scale(1.01);
}

.print-root {
  /*border: #1485FE solid 1px;*/
  /*需要将预览显示的界面限定在A4大小*/
  width: 210mm;
  /*这个高度为什么不是A4的大小，是经过N次验证的方式得到的，唯一的目的就是为了保证预览和打印预览一致*/
  /*可能是我写的有一点问题，但是如果设置为297，那么显示就会出现问题*/
  min-height: 150mm;
  /* margin-bottom: 24mm; */
  padding: 5mm;
  background-color: white;
}

@media print {
  /*最外层打印节点*/
  #printTest {
    display: block;
    height: auto;
    overflow: hidden;
  }
}

</style>
