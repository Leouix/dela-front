<script setup>
const props = defineProps({
    file: {
        type: Object,
        required: true
    }
})

</script>

<template>
    <div class="doc-icons">

        <a :href="props.file.url" download="" class="doc-icon doc-download-icon" title="Скачать">
        </a>

    </div>
</template>

<style scoped>

</style>
