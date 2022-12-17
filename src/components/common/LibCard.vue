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
                        <div style="height: 20%">创建者:{{ card.creator }}</div>
                        <h2 style="height: 40%">{{ card.libName }}</h2>
                        <div style="height: 40%">{{ card.desc }}12132</div>
                    </div>
                </div>
                <div class="d-flex justify-space-between" style="height: 24px;line-height: 27px">
                    <div style="margin-top: -3px">
                        <v-chip v-if="card.common" style="margin-right: 5px" outlined small color="primary">
                            公开
                        </v-chip>
                        <v-chip outlined small color="primary">
                            我的
                        </v-chip>
                    </div>
                    <div class="d-flex">
                        <div class="d-flex" style="margin-right: 5px">
                            <v-icon color="red">mdi-heart</v-icon>
                            <div>{{ card.quote }}123</div>
                        </div>
                        <div class="d-flex" style="margin-right: 5px">
                            <v-icon color="primary">mdi-contain</v-icon>
                            <div>{{ card.contentCnt }}123</div>
                        </div>
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
                creator: '',
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
