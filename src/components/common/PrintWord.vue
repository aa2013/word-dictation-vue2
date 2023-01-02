<template>
    <div class="word-container d-flex justify-center flex-column">
        <div v-if="!hiddenWord">{{ word }}</div>
        <hr>
        <div v-if="hiddenWord">
            {{ explain }}
        </div>
    </div>
</template>

<script>
    export default {
        name: "PrintWord",
        props: {
            hiddenWord: false,
            word: '',
            explain: ''
        }
    }
</script>

<style scoped lang="less">
    .word-container {
        text-align: center;
        width: 30mm;
        height: 20mm;
        font-size: 14pt;
        margin-right: 3mm;
      >hr{
        margin:2mm 0;
      }
      >div{
        line-height: 22px;
        height: 22px;
        overflow: hidden;
      }
    }
</style>
