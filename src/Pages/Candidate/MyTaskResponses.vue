<script setup>

import {useUtilsStore} from "@/stores/utils.js";
import AppLayout from "@/Layouts/AppLayout.vue";
import {Head} from "@inertiajs/vue3";

const props = defineProps({
    taskApplications: Object|null,
})

const utilsStore = useUtilsStore();

</script>

<template>
    <Head title="Мои отклики на задачи" />
    <AppLayout>

        <h1>Мои отклики</h1>
        <div v-if="props.taskApplications.length > 0" v-for="item in props.taskApplications" :key="item?.id" class="responses item post-card">
            <div class="company">
                <h2 class="post-card__title">Название задачи: <a :href="`/overview/task/` + item.task?.slug">{{ item.task?.title }}</a></h2>

                <p v-html="item.task.text" class="post-card__text"></p>

                <div class="post-card__footer">
                    <span class="post-card__date">Дата отклика: {{ utilsStore.formatLocalTime(item.created_at) }}</span>
                </div>
            </div>
            <div class="vacancy-company">
                Заказчик:
                <a
                    :href="route(
                        'company.overview', {
                        id: item.task.author.user_company.id
                    })">
                        {{ item.task.author.user_company.title ?? 'Без названия' }}
                </a>

            </div>
        </div>
    </AppLayout>
</template>

<style scoped>

</style>
