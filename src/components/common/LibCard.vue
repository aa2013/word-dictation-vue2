<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-card shaped :elevation="hover?2:0" flat v-ripple transition="fade-transition"
              class="card-container d-flex flex-column">
        <div class="flex-grow-1 d-flex" style="margin-bottom: 10px">
          <div style="width: 100px;height:100%;margin-right: 5px">
            <v-img style="border-radius: 5px" ref="img" aspect-ratio="0.8" src="../../assets/img/cover.jpg"
                   alt=""/>
          </div>
          <div style="height: 100%">
            <div style="height: 20%">创建者:{{ card.creatorName }}</div>
            <h2 style="height: 40%">{{ card.libName }}</h2>
            <div style="height: 40%">{{ card.desc }}12132</div>
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
                  <v-icon color="primary" class="m5r">mdi-contain</v-icon>
                  <div>{{ card.cnt }}</div>
                </div>
              </template>
              <span>单词数量</span>
            </v-tooltip>
          </div>
          <div style="margin-top: -3px">
            <v-chip v-if="card.common" style="margin-right: 5px" outlined small color="primary">
              公开
            </v-chip>
          </div>
        </div>
      </v-card>
    </v-hover>
  </div>

</template>

<script>
export default {
  name: "LibCard",
  props: {
    card: {
      img: '',
      creatorName: '',
      libName: '',
      desc: '',
      quote: 0,
      contentCnt: 0,
      common: false
    }
  },
  computed: {}
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
</style>
