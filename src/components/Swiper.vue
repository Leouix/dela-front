<script setup>
import {ref} from "vue"
import ImageLightbox from "@/components/ImageLightbox.vue"
import DocumentsIconDelete from "@/components/DocumentsIconDelete.vue";

defineProps({
    images: Object
})

const isLightboxOpen = ref(false)
const selectedImageIndex = ref(0)

function openLightbox(index) {
    selectedImageIndex.value = index
    isLightboxOpen.value = true
}

const emit = defineEmits([
    'add-documents',
    'delete-document',
    'delete-added-document'
])

const deletingIds = ref(new Set())

function deleteFile(image) {
    deletingIds.value.add(image.id)
    emit('delete-document', image)
}

</script>

<template>

    <ul class="images-preview">
        <li
            v-for="(image, index) in images"
            :key="image.id"
            :class="{ deleting: deletingIds.has(image.id) }"
        >
            <img
                :src="image.url"
                alt="task-document"
                @click="openLightbox(index)"

            >
            <span class="file-name">{{image.name}}</span>
            <DocumentsIconDelete :file="image" @delete="deleteFile(image, index)" />
        </li>
    </ul>

    <ImageLightbox
        v-if="isLightboxOpen"
        :images="images"
        :startIndex="selectedImageIndex"
        @close="isLightboxOpen = false"
    />
</template>

<style scoped>
ul.images-preview {

    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: start;
    list-style: none;
    margin: 0;
    padding: 5px 15px;


    img {
        width: 100px;
        border-radius: 4px;
        cursor: pointer;
    }

    li {
        display: flex;
        gap: 15px;
        align-items: end;
        transition: opacity 0.25s ease;

        &.deleting {
            opacity: 0.3;
        }
    }
}


</style>
