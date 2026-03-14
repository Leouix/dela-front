<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
    file: Object
})

const fileContent = ref('')

const getExtension = (path) => {
    try {
        const { pathname } = new URL(path, window.location.origin)
        return pathname.split('.').pop().toLowerCase()
    } catch {
        return ''
    }
}

const type = computed(() => {
    const ext = getExtension(props.file.url)

    if (['png','jpg','jpeg','webp','gif'].includes(ext)) return 'image'
    if (ext === 'pdf') return 'pdf'
    if (['doc','docx','xls','xlsx'].includes(ext)) return 'office'
    if (['txt','xml','json'].includes(ext)) return 'text'
    if (ext === 'zip') return 'zip'

    return 'unknown'
})

onMounted(async () => {
    if (type.value === 'text') {
        const res = await axios.get(props.file.url)
        fileContent.value = res.data
    }
})
</script>

<template>
    <div>
        <img v-if="type === 'image'" :src="file.url" class="preview-image" alt="preview doc"/>

        <iframe
            v-else-if="type === 'pdf'"
            :src="file.url"
            width="100%"
            height="600px"
        />

        <iframe
            v-else-if="type === 'office'"
            :src="`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`"
            width="100%"
            height="600px"
        />

        <pre v-else-if="type === 'text'">
            {{ fileContent }}
        </pre>

        <div v-else>
            <a :href="file.url" download>Скачать файл</a>
        </div>
    </div>

</template>

<style scoped>
.preview-image {
    max-width: 100%;
    max-height: 70vh;
}
</style>
