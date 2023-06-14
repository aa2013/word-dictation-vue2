<template>
  <v-app>
    <v-dialog
        v-model="show"
        :persistent="prevent"
        :max-width="maxWidth"
        @click:outside="outside"
    >
      <v-card>
        <v-card-title class="text-h6">
          <v-icon v-show="iconColor!==''" :color="iconColor" :style="iconMargin">
            {{ icon }}
          </v-icon>
          {{ title }}
        </v-card-title>
        <v-card-text class="text-h6" v-html="content">
        </v-card-text>
        <v-card-actions>
          <v-btn
              :color="neutralColor"
              text
              v-show="neutralShow"
              @click="neutral"
          >
            {{ neutralText }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              :color="leftColor"
              text
              style="margin-right: 10px"
              @click="left"
              v-show="leftShow"
          >
            {{ leftText }}
          </v-btn>
          <v-btn
              :color="rightColor"
              text
              @click="right"
              v-show="rightShow"
          >
            {{ rightText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    title: {
      default: "提示"
    },
    content: {
      default: '内容'
    },
    rightText: {
      default: "确定"
    },
    leftText: {
      default: "取消"
    },
    neutralText: {
      default: "中立"
    },
    maxWidth: {
      default: 290
    },
    prevent: {
      default: false
    },
    leftColor: {
      default: 'primary'
    },
    rightColor: {
      default: 'primary'
    },
    neutralColor: {
      default: 'primary'
    },
    icon: {
      default: 'mdi-information-outline'
    },
    type: {
      default: ''
    },
    neutralShow: {
      default: false
    },
    leftShow: {
      default: true
    },
    rightShow: {
      default: true
    },
  },
  data() {
    return {
      show: false,
      iconColors: {
        "success": 'primary',
        "info": 'green',
        "warn": 'orange',
        "danger": '#ff4081',
      }
    }
  },
  computed: {
    iconMargin() {
      if (Object.keys(this.iconColors).includes(this.type)) {
        return 'margin-right: 10px'
      }
      return ''
    },
    iconColor() {
      if (Object.keys(this.iconColors).includes(this.type)) {
        return this.iconColors[this.type]
      }
      return ''
    }
  },
  methods: {
    right() {
      this.rightClick()
    },
    left() {
      this.leftClick()
    },
    neutral() {
      this.neutralClick()
    },
    outside() {
      this.outsideClick()
    },
    close() {
      this.show = false
    }
  }
}
</script>

<style scoped>

</style>
