<script setup>

import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";
import {Head} from "@inertiajs/vue3";

const props = defineProps({
    postItems: Object|null,
});

const utilsStore = useUtilsStore();

function dtoItem(item) {
    return {
        id: item.id,
        title: item.title,
        text: item.text,
        post_status: item.post_status === 'publish' ? 'Опубликовано' : 'Черновик',
        created_at: utilsStore.formatLocalTime(item.created_at),
        cost: item.cost,
        partner_message: item.partner_message,
        slug: item.slug,
    }
}

function mappedItems(items) {
    return items.map(item => dtoItem(item))
}

</script>


<template>
    <Head title="Мои вакансии" />
    <AppLayout>
        <div class="overview">
            <h1 class="overview__title">Мои вакансии</h1>
            <div class="items">

                <div v-for="item in mappedItems(props.postItems)" :key="item?.id" class="item post-card">

                    <a :href="item.partner_message ? `/company/edit-partner-vacancy/${item.slug}` : `/my/company/edit-vacancy/${item.slug}`" rel="noopener noreferrer">Редактировать</a>

                    <a :href="`/overview/vacancy/${item.slug}`" rel="noopener noreferrer"><h2 class="post-card__title">{{ item.title }}</h2></a>

                    <h3>Описание вакансии: </h3>
                    <div v-html="item.text" class="post-card__text"></div>

                    <p class="post-card__cost">Оплата и Стоимость: {{ item.cost ?? 'Не указано' }}</p>

                    <p class="status">Статус: {{ item.post_status}}</p>

                    <div class="post-card__footer">
                        <span class="post-card__date">{{ item.created_at }}</span>

                    </div>

                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
.overview {
    margin: 0 auto;
}

.overview__title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
}

.items {
    display: flex;
    flex-wrap: wrap;
}


.item {
    width: 100%;
}



@media (min-width: 865px) {
    .item {
        width: 30%;
        min-width: 350px;
    }
}

</style>
