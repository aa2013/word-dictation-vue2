<template>
    <v-app>

    </v-app>
</template>

<script>

    export default {
        name: 'App',
        data: () => ({}),
        created() {
            throw this.dialog({
                prevent: false
            }).then(r => {
                console.log(r)
            })
        }
    };
</script>
