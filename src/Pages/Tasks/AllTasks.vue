<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";


const props = defineProps({
    items: Array
})
const utilsStore = useUtilsStore();
const textLength = 350;

function previewText(text) {
    return text.length > textLength
        ? text.substring(0, textLength) + '...'
        : text;
}

function getItemUrl(item) {
    if (item.type === 'tg.freelance') {
        return `/freelance-tgb/${item.slug}`;
    }

    return `/overview/task/${item.slug}`;
}


</script>

<template>

    
    <AppLayout>
        <div class="overview">
            <h1 class="overview__title">Все задачи</h1>

            <div class="items">
                <a
                    v-for="item in items"
                    :key="item.id"
                    :href="getItemUrl(item)"
                    class="item post-card post-card--link"
                >
                    <div class="post-card__body">
                        <span class="note">Задача</span>

                        <h3 class="post-card__title">
                            {{ item.title }}
                        </h3>

                        <div
                            class="post-card__text"
                            v-html="previewText(item.text)"
                        />

                        <p class="post-card__cost yellow-text">
                            <span>Стоимость в USDT:</span>
                            {{ item.cost ?? 'Не указана' }}
                        </p>
                    </div>

                    <h4 v-if="item.documents?.length > 0">Приложения к задаче:</h4>
                    <ul class="list-documents">
                        <li v-for="document in item.documents" :key="document.url">
                            {{ document.name }}
                        </li>
                    </ul>

                    <div class="post-card__footer">
                        <div class="footer-card-date ">
                            <div class="yellow-text"><span>Дата публикации:</span></div>
                            <span class="post-card__date">
                                {{ utilsStore.formatLocalTime(item.created_at) }}
                            </span>
                        </div>

                        <div class="footer-card-date">
                            <div class="yellow-text"><span>Дедлайн:</span></div>
                            <span class="post-card__date">
                                {{ utilsStore.formatLocalTime(item.deadline) }}
                            </span>
                        </div>

                        <div class="vacancy-company">
                            <div class="yellow-text"><span>Заказчик:</span></div>

                            <a v-if="item.type !== 'tg.freelance'"
                                :href="route('company.overview', {
                                    slug: item.author.user_company.slug
                                })"
                                @click.stop
                            >
                                {{ item.company_supplier_name }}
                            </a>
                            <span v-else>Freelance</span>
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
