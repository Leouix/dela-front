<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {useCandidateStore} from "@/stores/candidate.js";
import {Head, usePage} from "@inertiajs/vue3";

const props = defineProps({
    company: Object,
    isFavoriteCompany: Boolean|null,
    customerStatistic: Object|null,
    myself: Boolean|null,
});
const page = usePage();
const userRole = page.props.auth?.user?.mode;

const title = props.company?.title;
const description = props.company?.description;
const location = props.company?.location ?? 'Не указано';
const count_position_type = props.company?.count_position_type.name;
const image = props.company?.image;

const store = useCandidateStore();
store.isFavoriteCompany = props.isFavoriteCompany

</script>

<template>
    <Head title="Обзор компании" />
    <AppLayout>

        <div class="overview-company">
            <div
                v-if="userRole==='candidate' && props.myself === false"
                @click="store?.toggleFavoriteCompany(props.company.id)"
                v-bind:class="
                    store?.isFavoriteCompany
                        ? 'favorite-company-icon'
                        : 'favorite-company-zero-icon'
                "
            ></div>

            <h1 class="overview__title">Название компании: {{title}}</h1>
            <img v-if="image?.url" :src="image?.url" alt="company-avatar" class="company-thumbnail">
            <div class="company-description">Описание: {{description}}</div>
            <div class="company-location">Местоположение компании: {{location}}</div>
            <div class="company-count-position-type">Количество сотрудников: {{count_position_type}}</div>
        </div>

        <div class="customer-statistic-area">
            <h4>Статистика задач компании:</h4>
            <div class="customer-statistic">
                <div v-for="(value, name, index) in customerStatistic.data" :key="index" :class="value.class">
                    <div>{{ name }}:</div> <div>{{ value.value }}</div>
                </div>
            </div>
        </div>

    </AppLayout>
</template>

<style scoped>

</style>
