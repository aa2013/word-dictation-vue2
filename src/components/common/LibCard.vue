<template>
  <div class="pos-relative overflow-hidden">
    <v-hover v-slot="{ hover }">
      <div>
        <div class="pos-absolute card-action-tag text-center radius-4 non-select cursor-pointer"
             v-ripple="card.self" @click.stop="showDialog"
             :style="{background:card.self?'':'gray'}"
             :class="hover?'card-action-tag-hover':'card-action-tag-not-hover'">
          编辑
        </div>
        <div class="pos-absolute card-action-tag text-center radius-4 non-select cursor-pointer"
             v-ripple @click.stop="showRemoveDialog"
             :class="hover?'card-action-tag-hover':'card-action-tag-not-hover'">
          {{ card.self ? '删除' : "移除" }}
        </div>
        <v-card shaped :elevation="hover?2:0" flat v-ripple transition="fade-transition"
                class="card-container d-flex flex-column">
          <div class="flex-grow-1 d-flex" style="margin-bottom: 10px">
            <div style="width: 100px;height:100%;margin-right: 5px">
              <v-img style="border-radius: 5px" ref="img" aspect-ratio="0.8" :src="card.cover"
                     :alt="card.libName+'封面'"/>
            </div>
            <div style="height: 100%">
              <div style="height: 20%">创建者:{{ card.creatorName }}</div>
              <h3 style="height: 45%">{{ card.libName }}</h3>
              <div style="height: 35%;font-size: 13px">{{ card.desc }}</div>
            </div>
          </div>
          <div class="d-flex justify-space-between" style="height: 24px;line-height: 27px">
            <div class="d-flex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div class="d-flex" style="margin-right: 5px" v-bind="attrs" v-on="on">
                    <v-icon color="red" class="m5r">mdi-heart</v-icon>
                    <div>{{ card.uses }}</div>
                  </div>
                </template>
                <span>使用人数</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div class="d-flex" style="margin-right: 5px" v-bind="attrs" v-on="on">
                    <v-icon color="primary" class="m5r">mdi-alpha-n</v-icon>
                    <div>{{ card.cnt }}</div>
                  </div>
                </template>
                <span>单词数量</span>
              </v-tooltip>
            </div>
            <div style="margin-top: -3px">
              <v-chip v-if="card.self" class="m5r" outlined small color="primary">
                我的
              </v-chip>
              <v-chip v-if="card.common" class="m5r" outlined small color="primary">
                公开
              </v-chip>
            </div>
          </div>
        </v-card>
      </div>
    </v-hover>
  </div>

</template>

<script>
import * as lib from "@/network/details/lib"

export default {
  name: "LibCard",
  props: {
    card: {
      img: '',
      creatorName: '',
      libName: '',
      cover: 'http://img.coclyun.top/wordDictation/default_cover.jpg',
      desc: '',
      quote: 0,
      self: false,
      contentCnt: 0,
      common: false
    }
  },
  computed: {},
  methods: {
    showDialog() {
      if (this.card.self)
        this.$emit("showEditDialog")
    },
    showRemoveDialog() {
      let type = this.card.self ? '删除' : "移除"
      let html = ` <span style="font-size: 17px">
                    是否确认${type}词库 <span style="color: red">${this.card.libName}</span> ?
                    <br/>
                  </span>`
      if (this.card.self && this.card.common) {
        html += `<p style="font-size: 13px">
          公开且有其他用户的词库仅设为关闭状态。其他未添加用户无法使用。
        </p>`
      } else {
        html += `<p style="font-size: 15px">
            <span style="color: red">无法撤销！</span>
        </p>`
      }
      this.dialog.show({
        title: `${type}提示`,
        type: "warn",
        content: html
      }).onRightClick(() => {
        lib.remove(this.card.id).then(res => {
          if (res.data === true) {
            this.snackBar.show("删除成功")
            this.$emit("onRemoved")
          } else {
            this.snackBar.show("删除失败")
          }
        }).catch(err => {
          this.snackBar.error(err.desc)
        })
      })
    }
  }
}
</script>

<style scoped>
.card-container {
  height: 177px;
  width: 333px;
  cursor: pointer;
  transition: all 0.2s linear;
  padding: 10px;
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
}

.card-container:hover {
  transform: scale(1.01);
  /*border: #C7C9E9 solid 2px;*/
}

.pos-relative .card-action-tag-hover {
  right: 5px;
}

.pos-relative .card-action-tag-not-hover {
  right: -50px;
}

.pos-relative .card-action-tag {
  --top: 10px;
  --line-height: 25px;
  z-index: 1;
  width: 50px;
  line-height: var(--line-height);
  color: white;
  font-size: 13px;
  transition: all 0.2s ease-out;
}

.pos-relative .card-action-tag:nth-child(1) {
  top: var(--top);
  background-color: dodgerblue;
}

.pos-relative .card-action-tag:nth-child(2) {
  top: calc(var(--line-height) + var(--top) * 2);
  background-color: red;
}
</style>
