<template>
    <v-app>
        <v-snackbar v-model="visibility" :timeout="time"
                    :left="left" :bottom="bottom" :top="top" :right="right" :color="color">
            {{ text }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    v-show="btnShow"
                    :color="btnColor"
                    text
                    v-bind="attrs"
                    @click="btnClick">
                    {{ btnText }}
                </v-btn>
            </template>
        </v-snackbar>
    </v-app>

</template>

<script>
export default {
    name: "SnackBar",
    props: {
        visibility: {
            default: false
        },
        top: {
            default: true
        },
        bottom: {
            default: false
        },
        left: {
            default: false
        },
        right: {
            default: false
        },
        time: {
            default: 3000
        },
        color: {
            default: 'primary'
        },
        text: {
            default: ""
        },
        btnColor: {
            default: 'white'
        },
        btnText: {
            default: '确定'
        },
        btnShow: {
            default: false
        },
    },
    methods: {
        btnClick() {
            this.onClick()
        }
    }
}
</script>

<style scoped>

</style>
