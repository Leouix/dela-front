<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import { useUtilsStore } from "@/stores/utils.js";
import { computed } from "vue";
import {Head} from "@inertiajs/vue3";

const props = defineProps({
    items: Array
});

const utilsStore = useUtilsStore();
const textLength = 350;

function previewText(text) {
    return text.length > textLength
        ? text.substring(0, textLength) + '...'
        : text;
}

const mappedItems = computed(() =>
    props.items.map(item => ({
        ...item,
        type: item?.type === 'vacancy'
            ? 'Вакансия'
            : 'Партнерская вакансия'
    }))
);

function getItemUrl(item) {
    if (item.is_partner === 0) {
        return item.url;
    }
    return `/view-vacancy/${item.id}`;
}
</script>

<template>
    <Head title="Все вакансии" />
    <AppLayout>
        <div class="overview">
            <h1 class="overview__title">Все вакансии</h1>

            <div class="items">
                <a
                    v-for="item in mappedItems"
                    :key="item.id"
                    :href="getItemUrl(item)"
                    class="item post-card post-card--link"
                >
                    <span class="note">{{ item.type }}</span>

                    <div class="post-card__body">
                        <h3 class="post-card__title">
                            {{ item.title }}
                        </h3>

                        <div
                            class="post-card__text"
                            v-html="previewText(item.text)"
                        />

                        <p class="post-card__cost">
                            Стоимость:
                            {{ item.cost ?? 'Не указана' }}
                        </p>
                    </div>

                    <div class="post-card__footer">
                        Дата публикации:
                        <span class="post-card__date">
                            {{ utilsStore.formatLocalTime(item.created_at) }}
                        </span>

                        <div class="vacancy-company">
                            Заказчик:
                            <template v-if="!item.is_partner">
                                <a
                                    :href="route('company.overview', {
                                        slug: item.author.user_company.slug
                                    })"
                                    @click.stop
                                >
                                    {{ item.company_supplier_name }}
                                </a>
                            </template>

                            <template v-else>
                                <div class="partner-name">
                                    {{ item.company_partner_name }}
                                </div>
                            </template>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </AppLayout>
</template>


<style scoped>
.post-card--link {
    display: block;
    text-decoration: none;
    color: inherit;
    transition: background .2s ease;
}

.post-card--link:hover {
    background: rgb(26 20 90 / 10%);
    text-decoration: none;
}

/* v-html */
::v-deep(.post-card__text img) {
    border-radius: 3px;
}

</style>
