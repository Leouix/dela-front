<script setup> import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";

const props = defineProps({items: Array})
const utilsStore = useUtilsStore();
const textLength = 350;

function previewText(text) {
    return text.length > textLength ? text.substring(0, textLength) + '...' : text;
}

</script>

<template>
    <AppLayout>
        <div class="overview"><h1 class="overview__title">Все записи:</h1>
            <div class="items">
                <div v-for="item in items" :key="item?.id" class="item post-card">
                    <div class="post-card__body"><a :href="item?.url" rel="nofollow"><h3
                        class="post-card__title">{{ item.title }}</h3></a>
                        <div v-html="previewText(item.text)" class="post-card__text"></div>
                        <p class="post-card__cost">Стоимость в USDT: {{ item.cost ?? 'Не указана' }}</p></div>
                    <div class="post-card__footer"> Дата публикации: <span
                        class="post-card__date">{{ utilsStore.formatLocalTime(item.created_at) }}</span>
                        <div class="vacancy-company"> Заказчик: <a
                            v-if="item.is_partner === 0"
                            :href="route( 'company.overview', { id: item.author.user_company.id })">
                            {{ item.company_supplier_name }} </a>
                            <div class="partner-name" v-else>{{ item.company_partner_name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
