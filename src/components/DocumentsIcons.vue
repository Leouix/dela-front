<script setup>
const props = defineProps({
    file: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['download', 'delete'])

function onDownload(e) {
    e.stopPropagation()
    emit('download', props.file)
}

function onDelete(e) {
    e.stopPropagation()
    emit('delete', props.file)
}
</script>

<template>
    <div class="doc-icons">

        <a :href="props.file.url" download="" class="doc-icon doc-download-icon" title="Скачать">
        </a>

        <span
            class="doc-icon doc-delete-icon"
            title="Удалить"
            @click="onDelete"
        />
    </div>
</template>

<style scoped>

</style>
