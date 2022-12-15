<template>
    <v-app>
        <v-snackbar v-model="visibility" :timeout="time" top right :color="color">
            {{ text }}
            <template v-slot:action="{ attrs }">
                <v-btn
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
        data() {
            return {
                visibility: false,
                time: 3000,
                color: 'primary',
                text: "",
                btnColor: 'white',
                btnText: '确定',
            }
        },
        methods:{
            btnClick(){
                this.onClick()
            }
        }
    }
</script>

<style scoped>

</style>
