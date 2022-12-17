<template>
    <div>
        <v-card elevation="1" class="hw100" style="padding: 10px">
            <div class="d-flex flex-column justify-space-between" style="height: 100%">
                <el-table ref="table"
                          :data="tableData"
                          highlight-current-row
                          style="width: 100%">
                    <el-table-column
                        label="id"
                        prop="id"
                        align="center"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        label="库名"
                        align="center"
                        prop="libName"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        label="创建者"
                        align="center"
                        prop="creator"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        label="创建时间"
                        align="center"
                        prop="createTime"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        label="最后更新"
                        align="center"
                        prop="updateTime"
                        width="180">
                    </el-table-column>
                    <el-table-column label="操作" width="70"
                                     align="center">
                        <v-tooltip bottom slot-scope="scope">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon color="primary" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </template>
                            <span>添加为我的库</span>
                        </v-tooltip>
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
    import * as lib from '@/network/details/lib'
    import TableLoading from "@/components/tableLoading";

    export default {
        name: "CommonLib",
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
            lib.getListCommon({
                pageNum: this.page.current,
                pageSize: this.page.size
            }).then(res => {
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
