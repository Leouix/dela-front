<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from "@/Layouts/AppLayout.vue";
import {useFavoriteStore} from "@/stores/favorites.js";
import {useUtilsStore} from "@/stores/utils.js";


import axios from "axios";

const favoriteTasks = ref([])

const storeFavorite = useFavoriteStore();
const utilStore = useUtilsStore();

async function fetchData() {
    const response = await axios.post('/api/my/specialist/favorite-tasks')
    favoriteTasks.value = response.data.favoriteTasks
}

onMounted(() => {
    fetchData()
    storeFavorite.favoriteTasks = favoriteTasks.value.map(vacancy => {
        vacancy.isFavorite = true;
        return vacancy;
    });
})


</script>

<template>

    
    <AppLayout>

        <div v-for="task in storeFavorite?.favoriteTasks" class="favorite-vacancy-item">
            <div
                @click="storeFavorite?.toggleFavoriteTask(task.id)"
                v-bind:class="
                    task?.isFavorite
                        ? 'star-icon favorite'
                        : 'star-icon'
                "
            ></div>

            <a :href="`/overview/task/` + task.slug"><h2 class="post-card__title">{{ task.title }}</h2></a>
            <p v-html="utilStore.previewText(task.text)" class="post-card__text"></p>

            <div class="post-card__footer">
                <span class="post-card__date">Опубликовано: {{ utilStore.formatLocalTime(task.created_at) }}</span>
            </div>

            <div class="vacancy-company">
                <a :href="route('company.overview', {
                    id: task.author.user_company.id
                })">
                    Заказчик: {{ task.author.user_company.title ?? 'Без названия' }}
                </a>
            </div>

        </div>

    </AppLayout>
</template>

<style scoped>

</style>
