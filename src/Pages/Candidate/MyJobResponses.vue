<script setup>

import {useUtilsStore} from "@/stores/utils.js";
import AppLayout from "@/Layouts/AppLayout.vue";
import {Head} from "@inertiajs/vue3";

const props = defineProps({
    jobApplications: Object|null,
})

const utilsStore = useUtilsStore();

</script>

<template>
    <Head title="Мои отклики на вакансии" />
    <AppLayout>

        <h1>Мои отклики</h1>
        <div v-if="props.jobApplications.length > 0" v-for="item in props.jobApplications" :key="item?.id" class="responses item post-card">
            <div class="company">
                <h2 class="post-card__title">Название вакансии: <a :href="`/overview/vacancy/` + item.post_item?.id">{{ item.post_item?.title }}</a></h2>
                <p class="post-card__text">Описание вакансии: {{ item.post_item?.text }}</p>
                <div class="post-card__footer">
                    <span class="post-card__date">Дата отклика: {{ utilsStore.formatLocalTime(item.created_at) }}</span>
                </div>
            </div>
            <div class="vacancy-company">
                Заказчик:
                <a
                    v-if="item.post_item.is_partner === 0"
                    :href="route(
                        'company.overview', {
                        id: item.post_item.author.user_company.id
                    })">
                        {{ item.post_item.author.user_company.title ?? 'Без названия' }}
                </a>
                <div class="partner-name" v-else> {{ item.post_item.company_partner_name }}</div>

            </div>
        </div>
    </AppLayout>
</template>

<style scoped>

</style>
