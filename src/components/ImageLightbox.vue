<script setup>
import { onMounted, onUnmounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import {FreeMode, Navigation} from 'swiper/modules'

const props = defineProps({
    images: {
        type: Object,
        required: true
    },
    startIndex: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['close'])

function onKey(e) {
    if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
    <div class="lightbox">
        <div class="lightbox-overlay" @click="emit('close')"></div>

        <button class="close" @click="emit('close')">×</button>

        <Swiper
            :modules="[Navigation, FreeMode]"
            :free-mode="{ enabled: true, momentum: true, sticky: true }"
            :initial-slide="startIndex"
            :slides-per-view="1"
            :loop="true"
            :speed="350"
            :grab-cursor="true"
            :touch-ratio="1.2"

            :threshold="5"
            :resistance-ratio="0.85"
            :long-swipes="true"
            :long-swipes-ratio="0.2"
            :long-swipes-ms="200"
            :short-swipes="true"


            :navigation="false"

            :nested="true"
            class="lightbox-swiper"
        >

        <SwiperSlide v-for="img in images" :key="img.id">
                <img :src="img.url" class="lightbox-image" alt="task document">
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<style scoped>
.lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Фон, который закрывает лайтбокс */
.lightbox-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,.9);
    cursor: pointer;
}

.lightbox-swiper {
    width: initial;
    height: initial;
    position: relative;
    z-index: 1; /* Повышаем z-index над фоном */
    cursor: default;
}

@media screen and (min-width: 920px){

    .lightbox-swiper {
        width: 70vw;
        height: 90vh;
        position: relative;
        z-index: 1; /* Повышаем z-index над фоном */
        cursor: default;
    }
}

.lightbox-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: default;
}

.close {
    position: absolute;
    top: 20px;
    right: 25px;
    font-size: 32px;
    color: #fff;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10001; /* Повышаем z-index над всем */
}

:deep(.swiper-wrapper) {
    display: flex;
    align-items: center;      /* вертикально */
}
</style>
