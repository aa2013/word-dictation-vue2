<template>
    <v-progress-linear
        color="primary"
        indeterminate
        rounded
        :height="height"
        v-show="visibility"
    ></v-progress-linear>

</template>

<script>
    export default {
        name: "Loading",
        props: {
            height: {
                default: 3
            },
        },
        data: () => ({
            visibility: false
        }),
    }
</script>

<style scoped>
</style>
