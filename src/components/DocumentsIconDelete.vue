<script setup>
const props = defineProps({
    file: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['download', 'delete'])

function onDelete(e) {
    e.stopPropagation()
    emit('delete', props.image)
}
</script>

<template>
    <div class="doc-icons">

        <span
            class="doc-icon doc-delete-icon"
            title="Удалить"
            @click="onDelete"
        />
    </div>
</template>
