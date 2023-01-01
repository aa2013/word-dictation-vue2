<template>
    <div class="hw100">
        <div v-show="libId" class="hw100">
            <detail-lib :lib-id="libId" :lib-name="libName" class="hw100"></detail-lib>
        </div>
        <div v-show="!libId" class="d-flex flex-wrap">
            <lib-card @click.native="gotoDetail(item)" v-for="item in libs" style="margin-right: 10px" :card="item"/>
            <v-hover v-slot="{ hover }">
                <v-card class="add-card" shaped :elevation="hover?2:0" flat v-ripple transition="fade-transition">
                    <v-icon size="128" class="add-icon" color="primary">mdi-plus</v-icon>
                </v-card>
            </v-hover>
        </div>
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
            libName: ''
        }),
        watch: {
            $route(now) {
                this.libId = this.$route.query.id
                this.libName = this.$route.query.name
                console.log(!this.libId,now.path,this.libs)
                if (!this.libId && now.path==='/my-lib' && this.libs.length===0) {
                    this.getLibs()
                }
            },
        },
        created() {
            this.libId = this.$route.query.id
            this.libName = this.$route.query.name
            if (!this.libId) {
                this.getLibs()
            }
        },
        methods: {
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
            getLibs() {
                lib.getListSelf({
                    pageSize: 10,
                    pageNum: 1
                }).then(res => {
                    let data = res.data
                    this.libs = data.list
                })
            },
        }
    }
</script>

<style scoped lang="less">

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
