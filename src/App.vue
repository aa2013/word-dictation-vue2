<template>
    <v-app style="width: 100%;height: 100%">
        <router-view/>
    </v-app>
</template>

<script>

    export default {
        name: 'app',
        created() {
            if (!localStorage.getItem('token')) {
                if (window.location.pathname !== "/login") {
                    this.$router.push("/login")
                }
            }
        },
        mounted() {

        }
    }
</script>

<style>
</style>
