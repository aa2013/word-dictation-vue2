<template>
    <v-app style="width: 100%;height: 100%">
        <router-view/>
    </v-app>
</template>

<script>

    export default {
        name: 'app',
        created() {
            let loading = this.loading.show({autoClose: false})
            loading.setCloseAction((load) => {
                console.log(load)
                setTimeout(() => {
                    load.visibility = false
                }, 5000)
            })
            this.showSnackBar("123123")
            if (!localStorage.getItem('token')) {
                if (window.location.pathname !== "/login") {
                    // this.$router.push("/login")
                }
            }
        },
        mounted() {

        }
    }
</script>

<style>
</style>
