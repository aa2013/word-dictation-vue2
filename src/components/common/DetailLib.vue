<template>
    <div>
        <v-card elevation="1" class="hw100" style="padding: 10px">
            <div class="d-flex flex-column justify-space-between h100">
                <div style="margin-bottom: 10px" class="d-flex justify-space-between">
                    <div>
                        词库：测试123
                    </div>

                    <div>
                        已选：13个
                        <v-btn icon color="primary">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        随机选择
                        <v-btn icon color="primary">
                            <v-icon>mdi-repeat</v-icon>
                        </v-btn>
                    </div>

                </div>
                <el-table ref="table"
                          :data="tableData"
                          highlight-current-row
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
                        label="单词"
                        align="center"
                        prop="word"
                        min-width="150">
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
                                    <v-btn small icon color="primary" v-bind="attrs" v-on="on">
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
                                    <v-btn small icon color="primary" v-bind="attrs" v-on="on">
                                        <v-icon>mdi-volume-high</v-icon>
                                    </v-btn>
                                </template>
                                <span>播放</span>
                            </v-tooltip>
                        </div>
                    </el-table-column>
                    <el-table-column
                        label="释义"
                        align="center"
                        width="50">
                        <v-tooltip bottom slot-scope="scope">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon color="primary" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-eye</v-icon>
                                </v-btn>
                            </template>
                            <span>查看释义</span>
                        </v-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" width="150"
                                     align="center">
                        <div slot-scope="scope">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon color="primary" v-bind="attrs" v-on="on">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>更新</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon color="red" v-bind="attrs" v-on="on">
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
    </div>
</template>

<script>
    import * as word from '@/network/details/word'
    import TableLoading from "@/components/tableLoading";

    export default {
        name: "DetailLib",
        props: {
            libId: {}
        },
        data: () => ({
            tableData: [],
            loadShow: true,
            page: {
                size: 10,
                total: 0,
                current: 1
            }
        }),
        created() {
            word.getWordList({
                libId: this.libId,
                pageNum: 1,
                pageSize: 10
            }).then(res => {
                console.log(res)
                this.tableData = res.data.list
                this.page.total = res.data.total
                this.loadShow = false
                this.tableLoading.close()
            })
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
            currentChange() {

            },
            sizeChange() {

            }
        }
    }
</script>

<style scoped>

</style>
