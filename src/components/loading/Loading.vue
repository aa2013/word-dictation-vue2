<template>
    <v-app>
        <v-overlay z-index="9999" :value="visibility" class="text-center">
            <div style="display: flex;justify-content: center">
                <v-progress-circular color="blue" indeterminate width="3" :size="size"/>
            </div>
            <p style="margin-top: 10px;font-size: 14px">拼命加载中...</p>
            <v-btn color="primary" :class="cancelShow?'btn-show':'btn-hidden'" depressed rounded
                   @click="cancel">
                {{ cancelText }}
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
        },
        cancelText: {
            default: '取消加载'
        },
        visibility: {
            default: false
        },
        cancelShow: {
            default: false
        }
    },
    created() {
    },
    methods: {
        cancel() {
            if (!this.cancelShow)
                return
            this.close()
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
