<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from "@/Layouts/AppLayout.vue";
import {useFavoriteStore} from "@/stores/favorites.js";
import {useUtilsStore} from "@/stores/utils.js";


import axios from "axios";

const favoriteVacancies = ref([])

const storeFavorite = useFavoriteStore();
const utilStore = useUtilsStore();

async function fetchData() {
    const response = await axios.post('/api/my/specialist/favorite-vacancies')
    favoriteVacancies.value = response.data.favoriteVacancies
}

onMounted(() => {
    fetchData()
    storeFavorite.favoriteVacancies = favoriteVacancies.value.map(vacancy => {
        vacancy.isFavorite = true;
        return vacancy;
    });
})


</script>

<template>
    
    <AppLayout>

        <div v-for="vacancy in storeFavorite?.favoriteVacancies" class="favorite-vacancy-item">
            <div
                 @click="storeFavorite?.toggleFavoriteVacancy(vacancy.id)"
                 v-bind:class="
                    vacancy?.isFavorite
                        ? 'star-icon favorite'
                        : 'star-icon'
                "
            ></div>

            <a :href="`/overview/vacancy/` + vacancy.slug"><h2 class="post-card__title">{{ vacancy.title }}</h2></a>

            <p v-html="utilStore.previewText(vacancy.text)" class="post-card__text"></p>

            <div class="post-card__footer">
                <span class="post-card__date">Опубликовано: {{ utilStore.formatLocalTime(vacancy.created_at) }}</span>
            </div>

            <div class="vacancy-company">
                <a :href="route(
                'company.overview', {
                    id: vacancy.author.user_company.id
                })">
                    Заказчик: {{ vacancy.author.user_company.title ?? 'Без названия' }}
                </a>
            </div>

        </div>



    </AppLayout>
</template>

<style scoped>

</style>
