<script setup>

import AppLayout from "@/Layouts/AppLayout.vue";
import {onMounted} from "vue";
import {useFavoriteStore} from "@/stores/favorites.js";
import {useUtilsStore} from "@/stores/utils.js";
import {Head} from "@inertiajs/vue3";

const props = defineProps({
    favoriteVacancies: Object,
});

const storeFavorite = useFavoriteStore();
const utilStore = useUtilsStore();

onMounted(() => {
    storeFavorite.favoriteVacancies = props.favoriteVacancies.map(vacancy => {
        vacancy.isFavorite = true;
        return vacancy;
    });
})


</script>

<template>
    <Head title="Избранные вакансии" />
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
