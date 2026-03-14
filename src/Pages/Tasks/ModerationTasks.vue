<script setup>

import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";
import {useTasksStore} from "@/stores/tasks.js";


const props = defineProps({
    items: Object,
});

const utilsStore = useUtilsStore();
const store = useTasksStore();
</script>

<template>
    
    <AppLayout>
        <div class="overview">
            <h1 class="overview__title">Модерация</h1>
            <div class="items">
                <div v-for="item in items" :key="item.id" class="item post-card">
                    <a :href="`/overview/task/` + item.slug"><h2 class="post-card__title">{{ item.title }}</h2></a>

                    <h4 class="post-card__title">
                        Описание:
                    </h4>

                    <div v-html="item.text" class="post-card__text"></div>

                    <p class="post-card__text yellow-text"><span>Оплата и стоимость в USDT:</span> {{ item.cost }}</p>

                    <div class="post-card__footer">
                        <span class="post-card__date">{{ utilsStore.formatLocalTime(item.created_at) }}</span>
                        <span class="status">{{ item.status }}</span>
                    </div>

                    <div class="vacancy-company">Заказчик:
                        <a
                            :href="route(
                                'company.overview', {
                                    id: item.author.user_company.id
                                })">
                            {{ item.company_partner_name }}
                        </a>
                    </div>

                    <button @click="store.moderate(item.id)">Moderate</button>

                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>

</style>
