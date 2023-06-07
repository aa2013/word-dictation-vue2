<template>
  <v-dialog v-model="value.show" scrollable persistent width="230mm">
    <v-card>
      <v-card-title class="text-h5">
        打印预览
      </v-card-title>
      <v-card-text class="scroll-bar">
        <div id="printContent">
          <div class="print-root">
            <div v-for="i in repeatCount" :key="i">
              <div class="m10b d-flex flex-wrap justify-start align-content-start">
                <print-word v-for="(item,i) in getWords()" :key="i" :word="item.word"
                            :hidden-word="value.ch2en"
                            :explain="item.explain['explanation']"/>
              </div>
              <hr color="#eee" class="m10v" v-if="i!==repeatCount"/>
            </div>

          </div>
        </div>
        <iframe id="iframe" v-show="false" :src="printUrl"></iframe>
      </v-card-text>
      <v-card-actions style="align-items: center">
        <v-btn v-if="showPlanBtn"
               color="green darken-1"
               text
               @click="showPlanDialog">
          保存此方案
        </v-btn>
        <v-checkbox v-model="value.random"
                    hide-details
                    style="margin: 0" label="乱序"/>
        <v-checkbox v-model="value.ch2en"
                    hide-details
                    style="margin: 0" label="中译英"/>
        <div class="m10l" style="width:80px;">
          <v-text-field :value="value.repeat" dense @input="repeatChange"
                        hide-spin-buttons hide-details type="number" outlined label="重复"
                        suffix="次"/>
        </div>
        <v-spacer></v-spacer>
        <v-btn
            color="green darken-1"
            text
            @click="value.show = false">
          关闭
        </v-btn>
        <v-btn
            color="green darken-1"
            text
            @click="printPage">
          打印
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// 单词显示打印组件
import PrintWord from "@/components/common/PrintWord";

export default {
  name: "PrintPreviewDialog",
  components: {PrintWord},
  props: {
    value: {
      show: false,
      ch2en: false,
      random: false,
      repeat: 1
    },
    printWordList: {
      default: []
    },
    showPlanBtn: Boolean
  },
  computed: {
    // 重复次数
    repeatCount() {
      let val = this.value.repeat
      if (val === '') {
        return 1
      }
      let cnt = parseInt(val)
      return cnt <= 0 ? 1 : cnt
    },
    // 打印页面url
    printUrl() {
      return window.location.origin + '/print'
    },
  },
  methods: {
    getWords() {
      let temp = [...this.printWordList]
      if (this.value.random) {
        temp.sort(() => 0.5 - Math.random())
      }
      return temp
    },
    showPlanDialog() {
      this.$emit("showPlanDialog")
    },
    /**
     * 打印预览弹窗中的重复次数输入框监听
     * @param val 输入内容
     * */
    repeatChange(val) {
      if (!val) {
        this.value.repeat = 1
        return
      }
      let cnt = parseInt(val)
      // 限制最大为重复50次
      if (cnt > 50) {
        this.value.repeat = 50
      } else {
        this.value.repeat = cnt <= 0 ? 1 : cnt
      }
    },
    /**
     * 设置打印页面内容
     * */
    printPage() {
      let iframe = document.getElementById('iframe')
      let content = iframe.contentWindow.document.getElementById('content')
      let printContent = document.getElementById('printContent');
      content.innerHTML = printContent.innerHTML
      iframe.contentWindow.print()
    },
  }
}
</script>

<style scoped>

</style>
