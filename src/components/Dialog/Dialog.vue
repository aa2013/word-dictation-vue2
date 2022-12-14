<template>
    <v-app>
        <v-dialog
            v-model="show"
            :persistent="prevent"
            :max-width="maxWidth"
        >
            <v-card>
                <v-card-title class="text-h5">
                    <v-icon :color="iconColor" :style="iconMargin">{{ icon }}</v-icon>
                    {{ title }}
                </v-card-title>
                <v-card-text>
                    {{ content }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        :color="rightColor"
                        text
                        style="margin-right: 10px"
                        @click="left"
                    >
                        {{ cancelText }}
                    </v-btn>
                    <v-btn
                        :color="leftColor"
                        text
                        @click="right"
                    >
                        {{ okText }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
    export default {
        name: "Dialog",
        props: {
            title: {
                default: "提示"
            },
            content: {
                default: '内容'
            },
            okText: {
                default: "确定"
            },
            cancelText: {
                default: "取消"
            },
            maxWidth: {
                default: 290
            },
            prevent: {
                default: true
            },
            leftColor: {
                default: 'green darken-1'
            },
            rightColor: {
                default: 'green darken-1'
            },
            icon: {
                default: ''
            },
            type: {
                default: ''
            },
        },
        data() {
            return {
                show: false,
                iconColors: {
                    "success": 'primary',
                    "info": 'green',
                    "warn": 'yellow',
                    "danger": '#ff4081',
                }
            }
        },
        computed: {
            iconMargin() {
                if (Object.keys(this.iconColors).includes(this.icon)) {
                    return 'margin-right: 10px'
                }
                return ''
            },
            iconColor() {
                if (Object.keys(this.iconColors).includes(this.icon)) {
                    return this.iconColors[this.icon]
                }
                return ''
            }
        },
        methods: {
            right() {
                this.show = false
                this.$emit("right")
            },
            left() {
                this.show = false
                this.$emit("left")
            }
        }
    }
</script>

<style scoped>

</style>
