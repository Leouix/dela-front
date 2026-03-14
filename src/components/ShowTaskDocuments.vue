<script setup>
import SwiperShow from "@/components/SwiperShow.vue";
import DocumentsIconsDownload from "@/components/DocumentsIconsDownload.vue";
import {usePage} from "@inertiajs/vue3";
import {ref} from "vue";
import FilePreview from "@/components/FilePreview.vue";

const props = defineProps({
    documents: {
        type: Array,
        default: () => []
    }
})

const page = usePage();

const user = page.props?.auth?.user;
;
const countDocuments = props.documents.length;

function getFileType(path) {
    const ext = getExtension(path)

    if (imageExt.includes(ext)) return 'image'
    if (zipExt.includes(ext)) return 'zip'
    return 'file'
}

const imageExt = ['png', 'jpg', 'jpeg', 'webp', 'gif']
const zipExt = ['zip']

const { images, nonImages } = props.documents.reduce(
    (acc, d) => {
        if (getFileType(d.url) === 'image') {
            acc.images.push(d)
        } else {
            acc.nonImages.push(d)
        }
        return acc
    },
    { images: [], nonImages: [] }
)

function getExtension(path) {
    try {
        const { pathname } = new URL(path, window.location.origin)
        return pathname.split('.').pop().toLowerCase()
    } catch {
        return ''
    }
}

// Функция для получения иконки в зависимости от типа файла
function getFileIcon(file) {
    const fileType = getFileType(file.url || file.name);

    if (fileType === 'zip') {
        return '/images/icons/zip-icon.svg';
    }
    return '/images/icons/doc-file.svg';
}

// Функция для получения alt текста
function getFileAlt(file) {
    const fileType = getFileType(file.url || file.name);

    if (fileType === 'zip') {
        return 'zip archive';
    }
    return 'document';
}

const showPreview = ref(false)
const selectedFile = ref(null)

function openPreview(doc) {
    selectedFile.value = doc
    showPreview.value = true
}

function closePreview() {
    showPreview.value = false
    selectedFile.value = null
}
</script>

<template>
    <div class="documents-area">
        <p>Документы {{ countDocuments }}/10</p>

        <SwiperShow
            v-if="images.length > 0"
            :images="images"
        />

        <hr v-if="nonImages.length > 0 && images.length > 0">

        <ul class="list-documents" v-if="nonImages.length > 0">
            <li
                v-for="doc in nonImages"
                :key="doc.id"
            >
                <!-- Используем динамические иконки -->
                <img
                    :src="getFileIcon(doc)"
                    :alt="getFileAlt(doc)"
                >
                <span
                    class="file-name clickable"
                    @click="openPreview(doc)"
                > {{ doc.name }} </span>

                <DocumentsIconsDownload :file="doc" v-if="user"/>
            </li>
        </ul>
        <hr v-if="nonImages.length > 0">


    </div>

    <div v-if="showPreview" class="preview-modal">
        <div class="preview-content">
            <button class="close-btn" @click="closePreview">✕</button>

            <FilePreview
                v-if="selectedFile"
                :file="selectedFile"
                :key="selectedFile.url"
            />

        </div>
    </div>
</template>

<style scoped>
.documents-area {
    margin: 35px 0;
    padding: 15px;
    background: #0232cb12;

    @media screen and (min-width: 769px) {
        padding: 25px;
    }

    ul.list-documents {
        list-style: none;
        margin: 0;
        padding: 5px 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;


        li {
            display: flex;
            gap: 10px;
            align-items: center;
            transition: opacity 0.25s ease;

            &.deleting {
                opacity: 0.3;
                pointer-events: none;
            }

            img {
                width: 25px;
            }
        }
    }

}

.clickable {
    cursor: pointer;
    text-decoration: underline;
}

</style>
