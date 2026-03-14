<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";
import axios from "axios";


const items = ref([])
const utilsStore = useUtilsStore();
const textLength = 350;

async function fetchData() {
  axios.post('/api/home').then(response => {
    console.log({response})
    if (response?.data) {
      items.value = response.data
    }
  })
}

onMounted(() => {
    fetchData()
})

function previewText(text) {
    if (text && text?.length > 1) {
        return text.length > textLength ? text.substring(0, textLength) + '...' : text;
    }
    return '';
}

function dto(items) {

    const list = Array.isArray(items)
        ? items
        : Object.values(items ?? {});

    return list.map(item => ({
        ...item,
        label: item?.type === 'vacancy'
            ? 'Вакансия'
            : item?.type === 'task'
                ? 'Задача'
                : item?.type === 'tg.freelance'
                    ? 'Telegram Freelance'
                    : 'Партнерская вакансия'
    }));
}

function getItemUrl(item) {
    if (item.type === 'tg.freelance') {
        return `/freelance-tgb/${item.slug}`;
    }

    if (item.type === 'djinni') {
        return `/view-vacancy-dgj/${item.id}`;
    }

    return item.is_partner
        ? `/view-vacancy/${item.id}`
        : item.url
}

function getCompanyName(item) {
    if (item?.is_partner) {
        if (item?.type === 'tg.freelance' ) {
            return item?.company_name
        } else {
          return item?.company_partner_name
        }
    } else {
        return item?.company_supplier_name;
    }

}

</script>
<template>
    

    <AppLayout>



        <div class="overview">
            <h1 class="overview__title">Все записи:</h1>

            <div class="items">
                <a
                    v-for="item in dto(items)"
                    :key="item.id"
                    :href="getItemUrl(item)"
                    rel="nofollow"
                    class="item post-card post-card--link"
                >
                    <span class="note">{{ item.label }}</span>

                    <div class="post-card__body">
                        <h3 class="post-card__title">
                            {{ item.title }}
                        </h3>

                        <div
                            class="post-card__text"
                            v-html="previewText(item.text)"
                        />

                        <h4 v-if="item.documents?.length > 0">Приложения к задаче:</h4>
                        <ul class="list-documents">
                            <li v-for="document in item.documents" :key="document.url">
                                {{ document.name }}
                            </li>
                        </ul>

                        <p class="post-card__cost yellow-text">
                            <span>Стоимость, оплата:</span>
                            {{ item.cost ?? 'Не указана' }}
                        </p>
                    </div>

                    <div class="post-card__footer">
                        <div class="footer-card-date">
                            Дата публикации:
                            <span class="post-card__date">
                                {{ utilsStore.formatLocalTime(item.created_at) }}
                            </span>
                        </div>

                        <div class="footer-card-date" v-if="item?.deadline">
                            Дедлайн:
                            <span class="post-card__date">
                                {{ utilsStore.formatLocalTime(item?.deadline) }}
                            </span>
                        </div>

                        <div class="vacancy-company">
                            Заказчик:
                            <span>{{getCompanyName(item)}}</span>


                        </div>
                    </div>
                </a>
            </div>
        </div>
    </AppLayout>
</template>


<style scoped>


a.post-card {
    &.post-card--link:hover {

        text-decoration: none;
        background: rgb(26 20 90 / 10%);
    }
}

p {
    img {
        border-radius: 3px;
    }
}

::v-deep(.post-card__text img) {
    border-radius: 3px;
}

.post-card__cost {
    margin: 10px 0;
}

.list-documents {
    font-size: 16px;
}
</style>
