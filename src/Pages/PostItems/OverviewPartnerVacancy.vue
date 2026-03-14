<script setup> import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";

const props = defineProps({
    item: Object
})
const utilsStore = useUtilsStore();
const textLength = 350;

function previewText(text) {
    return text.length > textLength ? text.substring(0, textLength) + '...' : text;
}

const item = dto(props.item);
function dto(item) {

      item.type = item?.type === 'vacancy'
        ? 'Вакансия'
        : 'Партнерская вакансия';

    return item;
}

</script>

<template>
    <AppLayout>
        <div class="overview"><h1 class="overview__title">Все вакансии</h1>
            <div class="items">
                <div class="item post-card">
                    <span class="note">{{ item?.type }}</span>
                    <div class="post-card__body"><a :href="item?.url"><h3
                        class="post-card__title">{{ item.title }}</h3></a>
                        <div v-html="previewText(item.text)" class="post-card__text"></div>
                        <p class="post-card__cost">Оплата и стоимость: {{ item.cost ?? 'Не указана' }}</p></div>
                    <div class="post-card__footer"> Дата публикации: <span
                        class="post-card__date">{{ utilsStore.formatLocalTime(item.created_at) }}</span>
                        <div class="vacancy-company"> Заказчик: <a v-if="item.is_partner === 0"
                           :href="route( 'company.overview', { slug: item.author.user_company.slug })">
                            {{ item.company_supplier_name }} </a>
                            <div class="partner-name" v-else>{{ item.company_partner_name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>

</style>
