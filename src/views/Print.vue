<template>
    <div id="content"></div>
</template>

<script>
    import PrintWord from "@/components/common/PrintWord";
    export default {
        name: "Print",
        components:{PrintWord}
    }
</script>

<style scoped>

    .print-root {
        /*border: #1485FE solid 1px;*/
        /*需要将预览显示的界面限定在A4大小*/
        width: 210mm;
        /*这个高度为什么不是A4的大小，是经过N次验证的方式得到的，唯一的目的就是为了保证预览和打印预览一致*/
        /*可能是我写的有一点问题，但是如果设置为297，那么显示就会出现问题*/
        height: 297mm;
        /* margin-bottom: 24mm; */
        padding: 5mm;
        background-color: white;
    }

    @media print {
        /*最外层打印节点*/
        #printTest {
            display: block;
            height: auto;
            overflow: hidden;
        }
    }
</style>
