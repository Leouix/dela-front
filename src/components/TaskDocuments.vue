<script setup>
import { computed, ref } from 'vue'
import Swiper from "@/components/Swiper.vue"
import DocumentsIcons from "@/components/DocumentsIcons.vue"
import {useEditTaskStore} from "@/stores/editTask.js";

const props = defineProps({
    documents: {
        type: Array,
        default: () => []
    },
    addedDocuments: {
        type: Array,
        default: () => []
    },
    canEdit: {
        type: Boolean,
        default: false
    }
})

const deletingIds = ref(new Set())

const store = useEditTaskStore();

const emit = defineEmits([
    'add-documents',
    'delete-document',
    'delete-added-document'
])

function getFileType(path) {
    const ext = getExtension(path)

    if (imageExt.includes(ext)) return 'image'
    if (zipExt.includes(ext)) return 'zip'
    return 'file'
}

const imageExt = ['png', 'jpg', 'jpeg', 'webp', 'gif']
const zipExt = ['zip']

const { images, nonImages } = store.task.documents.reduce(
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

const countDocuments = computed(() => {
    return props.documents.length + props.addedDocuments.length
})

function getExtension(path) {
    try {
        const { pathname } = new URL(path, window.location.origin)
        return pathname.split('.').pop().toLowerCase()
    } catch {
        return ''
    }
}

function handleDeleteTaskFile(taskFile) {
    deletingIds.value.add(taskFile.id)
    emit('delete-document', taskFile)
}

function handleDeleteAddedTaskFile(taskFile) {
    deletingIds.value.add(taskFile.name) // если нет id у added
    emit('delete-added-document', taskFile)
}

function handleFileChange(e) {
    emit('add-documents', e)
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
</script>

<template>
    <div class="documents-area">
        <p>Документы {{ countDocuments }}/10</p>

        <Swiper
            v-if="images.length > 0"
            :images="images"
            @delete-document="handleDeleteTaskFile"
        />

        <hr v-if="nonImages.length > 0 && images.length > 0">

        <ul class="list-documents" v-if="nonImages.length > 0">
            <li
                v-for="doc in nonImages"
                :key="doc.id"
                :class="{ deleting: deletingIds.has(doc.id) }"
            >
                <!-- Используем динамические иконки -->
                <img
                    :src="getFileIcon(doc)"
                    :alt="getFileAlt(doc)"
                >
                <span class="file-name">{{ doc.name }}</span>
                <DocumentsIcons
                    v-if="canEdit"
                    :file="doc"
                    @delete="handleDeleteTaskFile(doc)"
                />
            </li>
        </ul>
        <hr v-if="nonImages.length > 0">

        <div>
            <label for="file-input" class="file-input-label">
                Загрузить файл или изображение
            </label>
            <input
                id="file-input"
                type="file"
                :accept="`
                    image/jpeg,
                    image/png,
                    image/webp,
                    application/pdf,
                    text/plain,
                    text/xml,
                    application/xml,
                    application/zip,
                    application/msword,
                    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                    application/vnd.ms-excel,
                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                `"
                multiple
                class="form-control"
                @change="handleFileChange"
            >

            <p class="file-formats">
                Допустимые форматы файлов: jpeg, png, webp, pdf, plain, xml, msword, zip
            </p>

            <div class="added-documents" v-if="addedDocuments?.length > 0">
                <h4>Несохраненные:</h4>
                <ul class="list-documents">
                    <li
                        v-for="(doc, index) in addedDocuments"
                        :key="index"
                        :class="{ deleting: deletingIds.has(doc.name) }"
                    >

                        <span class="file-name">{{ doc.name }}</span>
                        <span
                            class="doc-icon doc-delete-icon"
                            title="Удалить"
                            @click="handleDeleteAddedTaskFile(doc)"
                        />
                    </li>
                </ul>
            </div>
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

    .file-formats {
        color: #adbc46;
        font-size: 14px;
    }
}

.file-input-label {
    font-size: 16px;
}
</style>
