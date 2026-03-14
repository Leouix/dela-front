<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from "@/Layouts/AppLayout.vue";
import {useFavoriteStore} from "@/stores/favorites.js";


import axios from "axios";

const favoriteCompanies = ref([])

const storeFavorite = useFavoriteStore();

async function fetchData() {
    const response = await axios.post('/api/my/specialist/favorite-companies')
    favoriteCompanies.value = response.data.favoriteCompanies
}

onMounted(() => {
    fetchData()
    storeFavorite.favoriteCompanies = favoriteCompanies.value.map(company => {
        company.isFavorite = true;
        return company;
    });
})


</script>

<template>

    
    <AppLayout>

        <div v-for="company in storeFavorite?.favoriteCompanies" class="overview-company favorite-companies">
            <div
                @click="storeFavorite?.toggleFavoriteCompany(company.id)"
                v-bind:class="
                    company?.isFavorite
                        ? 'favorite-company-icon'
                        : 'favorite-company-zero-icon'
                "
            ></div>

            <h1 class="overview__title">Название компании: {{company.title}}</h1>
            <img v-if="company.image?.url" :src="company.image?.url" alt="company-avatar" class="company-thumbnail">
            <div class="company-description">Описание: {{company.description}}</div>
            <div class="company-location">Местоположение компании: {{company.location}}</div>
            <div class="company-count-position-type">Количество сотрудников: {{company.count_position_type}}</div>
        </div>

    </AppLayout>
</template>

<style scoped>

</style>
