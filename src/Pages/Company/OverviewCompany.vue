<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from "@/Layouts/AppLayout.vue";
import {useCandidateStore} from "@/stores/candidate.js";
import axios from "axios";

const route = useRoute();

const company = ref(null)
const isFavoriteCompany = ref(false)
const customerStatistic = ref({ data: {} })
const myself = ref(false)

const userRole = ref(null)

const store = useCandidateStore();

async function fetchData() {
    const response = await axios.post(`/api/overview/company-profile/${route.params.slug}`)
    company.value = response.data.company
    isFavoriteCompany.value = response.data.isFavoriteCompany
    myself.value = response.data.myself
}

onMounted(() => {
    fetchData()
    store.isFavoriteCompany = isFavoriteCompany.value
})

</script>

<template>
    
    <AppLayout>

        <div class="overview-company">
            <div
                v-if="userRole==='candidate' && myself === false"
                @click="store?.toggleFavoriteCompany(company?.id)"
                v-bind:class="
                    store?.isFavoriteCompany
                        ? 'favorite-company-icon'
                        : 'favorite-company-zero-icon'
                "
            ></div>

            <h1 class="overview__title">Название компании: {{ company?.title }}</h1>
            <img v-if="company?.image?.url" :src="company?.image?.url" alt="company-avatar" class="company-thumbnail">
            <div class="company-description">Описание: {{ company?.description }}</div>
            <div class="company-location">Местоположение компании: {{ company?.location ?? 'Не указано' }}</div>
            <div class="company-count-position-type">Количество сотрудников: {{ company?.count_position_type?.name }}</div>
        </div>

        <div class="customer-statistic-area">
            <h4>Статистика задач компании:</h4>
            <div class="customer-statistic">
                <div v-for="(value, name, index) in customerStatistic?.data" :key="index" :class="value.class">
                    <div>{{ name }}:</div> <div>{{ value.value }}</div>
                </div>
            </div>
        </div>

    </AppLayout>
</template>

<style scoped>

</style>
