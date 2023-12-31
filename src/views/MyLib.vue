<template>
  <div class="hw100">
    <!--    如果libId存在则显示该单词库详情-->
    <div v-if="libId" class="hw100">
      <detail-lib :id="libId" class="hw100"></detail-lib>
    </div>
    <!--    如果libId不存在则显示单词库列表-->
    <div v-else class="scroll-bar overflow-y-auto hw100">
      <div v-if="libs===null" class="d-flex flex-wrap" :class="isSingle?'justify-center':''">
        <v-card shaped elevation="0" style="width: 333px;
                background: transparent" class="p10 m10r m10b"
                v-for="i in 10" :key="i">
          <div class="d-flex justify-start m10b">
            <v-skeleton-loader type="image" :height="150" :width="125" class="mx-auto"/>
            <div class="d-flex flex-column flex-grow-1 m10l justify-space-around">
              <div v-for="i in 2" :key="i">
                <v-skeleton-loader type="text" class="w100" v-for="i in 3" :key="i"/>
              </div>
            </div>
          </div>
          <v-skeleton-loader type="text" class="mx-auto"></v-skeleton-loader>
        </v-card>
      </div>
      <div v-else-if="libs.length===0">
        <div class="horizontal-center d-flex flex-column" style="width: 400px">
          <img width="400" height="400" alt="什么都没有"
               src="@/assets/img/no_result.png"/>
          <div class="d-flex justify-space-around">
            <v-btn color="primary" text @click="showCreateDialog">
              <v-icon>mdi-plus</v-icon>
              创建词库
            </v-btn>
            <v-btn color="primary" text @click="gotoCommonLib">
              <v-icon>mdi-arrow-bottom-right</v-icon>
              导入词库
            </v-btn>
          </div>
        </div>
      </div>
      <div v-else class="d-flex flex-wrap " :class="isSingle?'justify-center':''">
        <v-hover v-slot="{ hover }">
          <v-card class="add-card m10b" :class="isSingle?'':'m10l'" shaped :elevation="hover?2:0"
                  flat v-ripple transition="fade-transition"
                  @click="showCreateDialog">
            <v-icon size="128" class="add-icon" :color="hover?'primary':''">mdi-plus</v-icon>
          </v-card>
        </v-hover>
        <lib-card @click.native="gotoDetail(item)" class="m10b" :class="isSingle?'':'m10l'"
                  @onRemoved="onCardRemoved(i)" @showEditDialog="showEditDialog(item)"
                  v-for="(item,i) in libs" :key="i" :card="item"/>
      </div>
    </div>
    <v-dialog v-model="createDialog.show" scrollable persistent max-width="420px">
      <v-card>
        <v-card-title class="text-h5">
          {{ createDialog.edit ? '编辑' : '创建' }}单词库
        </v-card-title>
        <v-card-text class="scroll-bar p5t">
          <div class="d-flex m5b">
            <div class="m5r" style="min-width: 130px">
              <v-hover v-slot="{ hover }">
                <label class="cursor-pointer radius-8 upload-label"
                       v-ripple for="cover">
                  <v-img style="border-radius: 5px" ref="img" aspect-ratio="0.8"
                         v-if="createDialog.data.coverB64 || createDialog.data.cover"
                         :src="createDialog.data.coverB64 || createDialog.data.cover" alt="单词库图片"/>
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
            <div class="flex-grow-1">
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
            {{ createDialog.edit ? '更新词库' : '创建' }}！
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
    libs: null,
    isSingle: false,
    createDialog: {
      edit: false,
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
      if (!this.libId && now.path === '/my-lib' && this.libs.length === 0) {
        this.getLibs()
      }
    },
  },
  computed: {
    libId() {
      return this.$route.query.id
    }
  },
  created() {
    // 如果libid不存在则加载我的单词库列表
    if (!this.libId) {
      this.getLibs()
    }
  },
  mounted() {
    this.isSingle = window.outerWidth < 715
    window.onresize = () => {
      this.isSingle = window.outerWidth < 715
    }
  },
  methods: {
    showEditDialog(item) {
      this.createDialog.show = true
      this.createDialog.edit = true
      this.createDialog.data = {...item}
    },
    onCardRemoved(i) {
      this.libs.splice(i, 1)
    },
    createLib() {
      this.createDialog.loading = true
      let data = {
        libName: this.createDialog.data.libName,
        desc: this.createDialog.data.desc,
        cover: this.createDialog.data.coverB64,
        common: this.createDialog.data.common,
      }
      if (this.createDialog.edit) {
        data.id = this.createDialog.data.id
        lib.update(data).then(res => {
          if (res.data === true) {
            this.snackBar.show("更新成功！")
            this.getLibs()
            this.createDialog.show = false
          } else {
            this.snackBar.error("更新失败")
          }
        }).catch(err => {
          this.snackBar.error(err.desc)
        }).finally(() => {
          this.createDialog.loading = false
        })
      } else {
        lib.create(data).then(res => {
          if (res.data === true) {
            this.snackBar.show("创建成功！")
            this.getLibs()
            this.createDialog.show = false
          } else {
            this.snackBar.error("创建失败")
          }
        }).catch(err => {
          this.snackBar.error(err.desc)
        }).finally(() => {
          this.createDialog.loading = false
        })
      }
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
    gotoCommonLib() {
      this.$router.push("/common-lib")
    },
    showCreateDialog() {
      this.createDialog.show = true
      this.createDialog.edit = false
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
      this.$router.push({
        path: '/my-lib',
        query: {
          id: lib.id,
        }
      })
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
