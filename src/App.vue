<template>
    <v-app>
        <router-view/>
    </v-app>
</template>

<script>
    export default {
        name: 'app',
        created() {
            this.loading.show()
            this.dialog.show()
            if (!localStorage.getItem('token')) {
                if (window.location.pathname!=="/login") {
                    // this.$router.push("/login")
                }
            }
        }
    }
</script>

<style>
</style>
