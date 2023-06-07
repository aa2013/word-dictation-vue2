<template>
  <div class="hw100">
    <!--    如果libId存在则显示该单词库详情-->
    <div v-show="libId" class="hw100">
      <detail-lib :lib-id="libId" :lib-name="libName" class="hw100"></detail-lib>
    </div>
    <!--    如果libId不存在则显示单词库列表-->
    <div v-show="!libId" class="d-flex flex-wrap">
      <v-hover v-slot="{ hover }">
        <v-card class="add-card" shaped :elevation="hover?2:0"
                flat v-ripple transition="fade-transition"
                @click="showCreateDialog">
          <v-icon size="128" class="add-icon" :color="hover?'primary':''">mdi-plus</v-icon>
        </v-card>
      </v-hover>
      <lib-card @click.native="gotoDetail(item)" class="m10l m10b"
                v-for="(item,i) in libs" :key="i" :card="item"/>
    </div>
    <v-dialog v-model="createDialog.show" scrollable persistent max-width="420px">
      <v-card>
        <v-card-title class="text-h5">
          创建单词库
        </v-card-title>
        <v-card-text class="scroll-bar p5t">
          <div class="d-flex m5b">
            <div class="flex-grow-1 m5r">
              <v-hover v-slot="{ hover }">
                <label class="cursor-pointer radius-8 upload-label"
                       v-ripple for="cover">
                  <v-img style="border-radius: 5px" ref="img" aspect-ratio="0.8"
                         v-if="createDialog.data.cover || createDialog.data.coverB64"
                         :src="createDialog.data.cover || createDialog.data.coverB64" alt="单词库图片"/>
                  <span v-else class="d-flex flex-column">
                    <v-icon size="48" :color="hover?'primary':''">
                      mdi-plus
                    </v-icon>
                    <span :style="{color:hover?'dodgerblue':''}">选择封面</span>
                  </span>
                </label>
              </v-hover>
              <input type="file" ref="file" id="cover" hidden="hidden"
                     @change="onCoverSelected" accept="image/*">
            </div>
            <div style="width: 230px;">
              <v-text-field outlined dense hide-details hide-spin-buttons
                            class="m10b" label="单词库名"
                            v-model="createDialog.data.libName"/>
              <v-textarea outlined rows="4" class="scroll-bar"
                          label="描述" hide-details
                          v-model="createDialog.data.desc"/>
            </div>
          </div>
          <div class="d-flex" style="line-height: 27px">
            权限设置：
            <v-switch inset v-model="createDialog.data.common" label="公开"
                      class="p0" dense hide-details
                      style="margin-top: 2px"/>
          </div>
        </v-card-text>
        <v-card-actions style="align-items: center">
          <v-spacer/>
          <v-btn
              color="green darken-1"
              text
              @click="createDialog.show = false">
            取消
          </v-btn>
          <v-btn
              color="green darken-1"
              text :loading="createDialog.loading"
              @click="createLib">
            创建！
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as lib from '@/network/details/lib'
import LibCard from "@/components/common/LibCard";
import DetailLib from '@/components/common/DetailLib.vue'

export default {
  name: "MyLib",
  components: {LibCard, DetailLib},
  data: () => ({
    libs: [],
    libId: false,
    libName: '',
    createDialog: {
      show: false,
      data: {
        libName: "",
        desc: "",
        coverB64: "",
        cover: "",
        common: false
      },
      loading: false
    }
  }),
  watch: {
    // 监听路由变化
    $route(now) {
      this.libId = this.$route.query.id
      this.libName = this.$route.query.name
      if (!this.libId && now.path === '/my-lib' && this.libs.length === 0) {
        this.getLibs()
      }
    },
  },
  created() {
    this.libId = this.$route.query.id
    this.libName = this.$route.query.name
    // 如果libid不存在则假装我的单词库列表
    if (!this.libId) {
      this.getLibs()
    }
  },
  methods: {
    createLib() {
      this.createDialog.loading = true
      let data = {
        libName: this.createDialog.data.libName,
        desc: this.createDialog.data.desc,
        cover: this.createDialog.data.coverB64,
        common: this.createDialog.data.common,
      }
      console.log(data)
      lib.create(data).then(res => {
        if (res.data === true) {
          this.snackBar.show("创建成功！")
          this.getLibs()
          this.createDialog.show = false
        } else {
          this.snackBar.show({
            color: "red",
            text: "创建成功！"
          })
        }
      }).catch(err => {
        this.snackBar.show({
          color: "red",
          text: err.desc
        })
      }).finally(() => {
        this.createDialog.loading = false
      })
    },
    onCoverSelected(event) {
      const file = event.target.files[0]
      //大小限制为512kb
      if (file.size > 512 * 1000) {
        this.snackBar.show({
          color: "red",
          text: "图片限制大小为512KB！"
        })
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        this.createDialog.data.coverB64 = reader.result
        file.value = ''
      }
      reader.readAsDataURL(file)
    },
    showCreateDialog() {
      this.createDialog.show = true
      this.createDialog.data = {
        libName: "",
        desc: "",
        coverB64: "",
        cover: "",
        common: false
      }
    },
    /**
     * 跳转新页面显示该单词库的详情
     * @param lib 单词库对象
     * */
    gotoDetail(lib) {
      let route = this.$router.resolve({
        path: '/my-lib',
        query: {
          id: lib.id,
          name: lib.libName
        }
      })
      window.open(route.href, '_blank')
    },
    /**
     * 获取库列表
     * */
    getLibs() {
      lib.getListSelf().then(res => {
        this.libs = res.data
      })
    },
  }
}
</script>

<style scoped lang="less">

.upload-label {
  height: 100%;
  border: 1px dashed dodgerblue;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.add-card {
  height: 177px;
  width: 333px;
  cursor: pointer;
  transition: all 0.2s linear;
  padding: 10px;
  position: relative;
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
  //background: rgba(238,238,238,0.8);
  background: transparent;

  .add-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.add-card:hover {
  transform: scale(1.01);
  /*border: #C7C9E9 solid 2px;*/
}
</style>
