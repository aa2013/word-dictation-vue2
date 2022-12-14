<template>
    <v-app>

    </v-app>
</template>

<script>

    export default {
        name: 'App',
        data: () => ({}),
        created() {
            this.dialog.show({
                icon:'mdi-home',
            }).onRightClick(ins=>{
                console.log("right")
                console.log(ins.content)
            })
        }
    };
</script>
