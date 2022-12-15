<template>
    <v-app>
        <v-overlay :value="visibility" class="text-center">
            <div style="display: flex;justify-content: center">
                <v-progress-circular color="blue" indeterminate width="3" :size="size"/>
            </div>
            <p style="margin-top: 10px;font-size: 14px">拼命加载中...</p>
            <v-btn color="primary" :class="cancelShow?'btn-show':'btn-hidden'" depressed rounded
                   @click="cancel">
                取消加载
            </v-btn>
        </v-overlay>
    </v-app>

</template>

<script>
    export default {
        name: "Loading",
        props: {
            size: {
                default: 48
            }
        },
        data: () => ({
            visibility: false,
            cancelShow: false
        }),
        created() {
        },
        methods: {
            cancel() {
                if (!this.cancelShow)
                    return
                this.close()
                this.showSnackBar("已取消加载！")
            }
        }
    }
</script>

<style scoped>
    .btn-show {
        opacity: 1;
        cursor: pointer;
        transition: all 0.3s linear;
    }

    .btn-hidden {
        opacity: 0;
        cursor: default;
        transition: all 0.3s linear;
    }
</style>
