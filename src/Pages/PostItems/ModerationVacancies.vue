<script setup>

import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";
import {usePostItemsStore} from "@/stores/post-items.js";
import {Head} from "@inertiajs/vue3";

const props = defineProps({
    items: Object,
});

const utilsStore = useUtilsStore();
const store = usePostItemsStore();
</script>

<template>
    <Head title="Модерация вакансий" />
    <AppLayout>
        <div class="overview">
            <h1 class="overview__title">Модерация</h1>
            <div class="items">
                <div v-for="item in items" :key="item.id" class="item post-card">
                    <a :href="`/overview/vacancy/` + item.slug"><h2 class="post-card__title">{{ item.title }}</h2></a>

                    <h4>Описание: </h4>
                    <div v-html="item.text" class="post-card__text"></div>

                    <p class="post-card__text">Оплата и Стоимость: {{ item.cost }}</p>
                    <div class="post-card__footer">
                        <span class="post-card__date">{{ utilsStore.formatLocalTime(item.created_at) }}</span>
                        <span class="status">{{ item.status }}</span>
                    </div>

                    <div class="vacancy-company">Заказчик:
                        <a
                            v-if="item.is_partner === 0"
                            :href="route(
                                'company.overview', {
                                    id: item.author.user_company.id
                                })">
                            {{ item.company_partner_name }}
                        </a>
                        <div class="partner-name" v-else> {{ item.company_partner_name }}</div>
                    </div>

                    <button @click="store.moderate(item.id)">Moderate</button>

                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>

</style>
