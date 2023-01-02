<template>
  <div>
    <v-card elevation="1" class="hw100" style="padding: 10px">
      <div class="d-flex flex-column justify-space-between h100">
        <div style="margin-bottom: 10px" class="d-flex justify-space-between">
          <div>
            词库：{{ libName }}
            <v-btn small outlined color="primary" @click="importDialog.show=true">
              导入单词
              <v-icon right>mdi-plus</v-icon>
            </v-btn>
          </div>
          <div>
            已选：{{ getSelectItems }}个，
            随机选择
            <v-btn icon color="primary">
              <v-icon>mdi-repeat</v-icon>
            </v-btn>
            <v-btn color="primary" outlined small @click="genDialog.show=true">生成</v-btn>
          </div>

        </div>
        <el-table ref="table"
                  :data="tableData"
                  highlight-current-row
                  @row-click="selectRow"
                  @selection-change="selectionChange"
                  style="width: 100%">
          <el-table-column
              align="center"
              type="selection"
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
              {{ scope.row['usSymbol'] }}
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click.stop="" small icon color="primary" v-bind="attrs" v-on="on">
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
              {{ scope.row['enSymbol'] }}
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click.stop="" small icon color="primary" v-bind="attrs" v-on="on">
                    <v-icon>mdi-volume-high</v-icon>
                  </v-btn>
                </template>
                <span>播放</span>
              </v-tooltip>
            </div>
          </el-table-column>
          <el-table-column label="操作" width="130"
                           align="center">
            <div slot-scope="scope">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click.stop="" icon color="primary" v-bind="attrs" v-on="on">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <span>查看</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click.stop="" icon color="primary" v-bind="attrs" v-on="on">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>编辑</span>
              </v-tooltip>
              <v-tooltip bottom>
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
    <v-dialog v-model="genDialog.show" scrollable persistent width="230mm">
      <v-card>
        <v-card-title class="text-h5">
          生成
        </v-card-title>
        <v-card-text>
          <div id="printContent">
            <div class="print-root d-flex flex-wrap justify-start align-content-start">
              <print-word v-for="(item,i) in selectItems" :key="i" :word="item.word"
                          :hidden-word="genDialog.hideWord"
                          :explain="item.explain['explanation']"/>
            </div>
          </div>
          <iframe id="iframe" v-show="false" :src="printUrl"></iframe>
        </v-card-text>
        <v-card-actions>
          <v-btn
              color="green darken-1"
              text
              @click="">
            保存此方案
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="randomResult">
            打乱顺序
          </v-btn>
          <v-checkbox v-model="genDialog.hideWord" hide-details
                      style="margin: 0" label="中译英"/>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="genDialog.show = false">
            关闭
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="printPage"
          >
            打印
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="importDialog.show" scrollable persistent width="350">
      <v-card>
        <v-card-title class="text-h5">
          单词导入
        </v-card-title>
        <div class="p10h" style="height: 300px">
          <v-textarea rows="10" v-model="importDialog.content"
                      v-show="!importDialog.previewShow"
                      label="一行一个" hide-details/>
          <div v-show="importDialog.previewShow" class="text-center">
            <img v-show="importDialog.words.length===0" width="200" height="200" src="../../assets/img/no_result.png"/>
            <div loading="true" v-show="importDialog.words.length!==0" v-ripple
                 v-for="(item,i) in importDialog.words" :key="i"
                 class="preview-word-card d-flex non-select">
              <div style="width: 40px">{{ i + 1 }}</div>
              <div class="flex-grow-1" style="text-align: left">{{ item.value }}</div>
              <div style="width: 40px">
                <v-icon v-show="item.status==='wait'" color="blue">
                  mdi-upload-outline
                </v-icon>
                <v-icon v-show="item.status==='ok'" color="primary">
                  mdi-check
                </v-icon>
                <v-icon v-show="item.status==='failed'" color="red">
                  mdi-alert-circle-outline
                </v-icon>
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
              @click="importDialog.show = importDialog.content=''">
            关闭
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="importDialogSubmit">
            {{ importDialog.previewShow ? "导入" : "预览" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as word from '@/network/details/word'
import TableLoading from "@/components/tableLoading";
import PrintWord from "@/components/common/PrintWord";
import {getOtherExplains} from "@/network/details/word";

export default {
  name: "DetailLib",
  components: {
    PrintWord
  },
  props: {
    libId: {},
    libName: '',
    selectItems: []
  },
  data: () => ({
    printOption: {
      id: 'printContent',
      popTitle: '',
    },
    tableData: [],
    loadShow: true,
    page: {
      size: 10,
      total: 0,
      current: 1
    },
    genDialog: {
      show: false,
      hideWord: false
    },
    importDialog: {
      show: false,
      previewShow: false,
      content: "",
      words: []
    }
  }),
  computed: {
    printUrl() {
      return window.location.origin + '/print'
    },
    getSelectItems() {
      if (this.selectItems) {
        return this.selectItems.length
      }
      return 0
    }
  },
  watch: {
    $route() {
      if (this.libId) {
        this.getWordList()
      }
    },
    "importDialog.content"(val) {
      this.importDialog.words = val.split("\n")
          .filter(v => {
            return v.trim().length !== 0
          })
          .map(v => ({
            value: v.trim(),
            status: 'wait'
          }))
    }
  },
  created() {
    if (this.libId) {
      this.getWordList()
    }
  },
  mounted() {
    let table = this.$refs['table']
    let header = table.$el.getElementsByClassName('el-table__header-wrapper')[0]
    let container = document.createElement('div')
    this.tableLoading = TableLoading.init(container)
    header.appendChild(container)
    this.tableLoading.show()
  },
  methods: {
    randomResult() {
      this.selectItems.sort(() => 0.5 - Math.random())
    },
    async importDialogSubmit() {
      if (!this.importDialog.previewShow) {
        this.importDialog.previewShow = true
        return
      }
      let words = this.importDialog.words
      for (let i = 0; i < words.length; i++) {
        let single = words[i]
        single.status = "uploading"
        await word.importSingle({
          libId: this.libId,
          word: single.value
        }).then(res => {
          single.status = "ok"
        }).catch(err => {
          single.status = "failed"
        })
      }
    },
    printPage() {
      let iframe = document.getElementById('iframe')
      let content = iframe.contentWindow.document.getElementById('content')
      let printContent = document.getElementById('printContent');
      content.innerHTML = printContent.innerHTML
      iframe.contentWindow.print()
    },
    selectRow(row) {
      this.$refs['table'].toggleRowSelection(row)
    },
    selectionChange(rows) {
      this.selectItems = rows
    },
    currentChange() {

    },
    sizeChange() {

    },
    getWordList() {
      word.getWordList({
        libId: this.libId,
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        this.tableData = res.data.list
        this.page.total = res.data.total
        this.loadShow = false
        this.tableLoading.close()
      })
    },
    getOtherExplains(row) {
      word.getOtherExplains({
        wordId: row.id,
        libId: this.libId,
        pageNum: 1,
        pageSize: 10
      }).then(res => {
      })
    },
    generateExplain(row) {
      let explains = row.explain;
      let type = explains['type']
      let explanation = explains['explanation']
      return `${type}. ${explanation}`
    }
  }
}
</script>

<style>
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
  border: #1485FE solid 1px;
  /*需要将预览显示的界面限定在A4大小*/
  width: 210mm;
  /*这个高度为什么不是A4的大小，是经过N次验证的方式得到的，唯一的目的就是为了保证预览和打印预览一致*/
  /*可能是我写的有一点问题，但是如果设置为297，那么显示就会出现问题*/
  height: 297mm;
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
