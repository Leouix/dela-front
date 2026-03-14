<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from "@/Layouts/AppLayout.vue";
import { useUtilsStore } from "@/stores/utils.js";


import axios from "axios";

const taskOrders = ref(null)

const utilsStore = useUtilsStore();

async function fetchData() {
    const response = await axios.post('/api/task-orders')
    taskOrders.value = response.data.taskOrders
}

onMounted(() => {
    fetchData()
})

const items = computed(() => {
    if (!taskOrders.value) return [];

    return taskOrders.value.map(item => ({
        id: item.id,
        title: item.task_application.task.title,
        text: item.task_application.task.text,

        post_status: item.order_status_type.label,
        post_status_name: item.order_status_type.name,

        created_at: utilsStore.formatLocalDate(item.created_at),
        deadline: utilsStore.formatLocalDate(
            item.deadline ?? item.task_application.task.deadline
        ),
        cost: item.task_application.task.cost,
        slug: item.slug,
        candidate_name:
            item.task_application.user_candidate.name
            ?? item.task_application.user_candidate.user.email,
        candidate_slug: item.task_application.user_candidate.slug,
    }));
});

const processingItems = computed(() =>
    items.value.filter(item => item.post_status_name === 'processing')
);

const otherItems = computed(() =>
    items.value.filter(item => item.post_status_name !== 'processing')
);

function getItemUrl(item) {
    return `/task-order/${item.slug}`;
}
</script>

<template>

    
    <AppLayout>

        <div class="overview">

            <div>
                <h1 class="overview__title">Задачи в работе:</h1>

                <div class="items">
                    <a
                        v-for="item in processingItems"
                        :key="item.id"
                        :href="getItemUrl(item)"
                        class="item post-card post-card--link"
                    >
                        <h2 class="post-card__title">
                            {{ item.title }}
                        </h2>

                        <p>
                            Мастер:
                            <a
                                :href="`/my/company/overview/candidate/${item.candidate_slug}`"
                                @click.stop
                            >
                                {{ item.candidate_name }}
                            </a>
                        </p>

                        <h3>Описание задачи:</h3>

                        <div
                            class="post-card__text"
                            v-html="item.text"
                        />

                        <p class="post-card__cost yellow-text">
                            <span>Оплата и стоимость в USDT:</span>
                            {{ item.cost ?? 'Не указано' }}
                        </p>

                        <p class="status yellow-text">
                            <span>Статус:</span> {{ item.post_status }}
                        </p>

                        <div class="post-card__footer">
                            <div class="footer-card-date">
                            <span class="post-card__date yellow-text">
                                <span>Создано:</span> {{ item.created_at }}
                            </span>
                            </div>
                            <div class="footer-card-date">
                            <span class="post-card__date yellow-text">
                                <span>Дедлайн:</span> {{ item.deadline }}
                            </span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            <h1 class="overview__title">Другие задачи:</h1>

            <div class="items">
                <a
                    v-for="item in otherItems"
                    :key="item.id"
                    :href="getItemUrl(item)"
                    class="item post-card post-card--link"
                >
                    <h2 class="post-card__title">
                        {{ item.title }}
                    </h2>

                    <p>
                        Мастер:
                        <a
                            class="yellow-text"
                            :href="`/my/company/overview/candidate/${item.candidate_slug}`"
                            @click.stop
                        >
                            {{ item.candidate_name }}
                        </a>
                    </p>

                    <h3>Описание задачи:</h3>

                    <div
                        class="post-card__text"
                        v-html="item.text"
                    />

                    <p class="post-card__cost yellow-text">
                        <span>Оплата и стоимость в USDT:</span>
                        {{ item.cost ?? 'Не указано' }}
                    </p>

                    <p class="status yellow-text">
                        <span>Статус:</span> {{ item.post_status }}
                    </p>

                    <div class="post-card__footer">
                        <div class="footer-card-date">
                            <span class="post-card__date yellow-text">
                                <span>Создано:</span> {{ item.created_at }}
                            </span>
                        </div>
                        <div class="footer-card-date">
                            <span class="post-card__date yellow-text">
                                <span>Дедлайн:</span> {{ item.deadline }}
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </AppLayout>
</template>


<style scoped>
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

.editable {
    text-decoration: underline;
    display: inline-block;
    margin-bottom: 10px;
}

.post-card__text {
    margin: 15px 0;
}
/* v-html */
::v-deep(.post-card__text img) {
    border-radius: 3px;
}

ul.list-documents {
    margin: 5px 0;
    li {
        font-size: 14px;
    }
}

h4 {
    margin: 15px 0;
}

</style>
