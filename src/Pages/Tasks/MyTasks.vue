<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from "@/Layouts/AppLayout.vue";
import { useUtilsStore } from "@/stores/utils.js";


const tasks = ref(null)

const utilsStore = useUtilsStore();

async function fetchData() {
    // TODO: axios.get('/api/...')
    // tasks.value = response.data
}

onMounted(() => {
    fetchData()
})

const items = computed(() => {
    if (!tasks.value) return [];

    return tasks.value.map(item => ({
        id: item.id,
        title: item.title,
        text: item.text,
        post_status: item.post_status.label,
        created_at: utilsStore.formatLocalTime(item.created_at),
        deadline: utilsStore.formatLocalDate(item.deadline),
        cost: item.cost,
        slug: item.slug,
        has_task_applications: item.has_task_applications,
        is_moderated: item.is_moderated,
        documents: item.documents ?? [],
    }));
});

function getItemUrl(item) {
    return `/overview/task/${item.slug}`;
}
</script>

<template>

    

    <AppLayout>
        <div class="overview">
            <h1 class="overview__title">Мои задачи</h1>

            <div class="items">
                <a
                    v-for="item in items"
                    :key="item.id"
                    :href="getItemUrl(item)"
                    class="item post-card post-card--link"
                >
                    <!-- редактирование -->
                    <a
                        :href="`/my/company/edit-task/${item.slug}`"
                        class="editable"
                        @click.stop
                        title="Редактировать"
                    >
                        <img src="/images/icons/edit.svg" alt="edit task">
                        <div>Редактировать</div>
                    </a>

                    <h2 class="post-card__title">
                        {{ item.title }}
                    </h2>

                    <div
                        class="post-card__text"
                        v-html="item.text"
                    />

                    <p class="post-card__cost yellow-text">
                        <span><u>Стоимость</u> в USDT:</span>
                        {{ item.cost ?? 'Не указано' }}
                    </p>

                    <p class="status">
                        <u class="yellow-text"><span>Статус:</span></u> {{ item.post_status }}
                        <span v-if="!item.is_moderated">
                            (на модерации)
                        </span>
                    </p>

                    <h4 v-if="item.documents?.length > 0">Приложения к задаче:</h4>
                    <ul class="list-documents">
                        <li v-for="document in item.documents" :key="document.url">
                            <a
                                :href="document.url"
                                download
                                @click.stop
                            >
                                {{ document.name }}
                            </a>
                        </li>
                    </ul>

                    <div class="post-card__footer">
                        <div class="footer-card-date">
                            <span class="post-card__date yellow-text">
                                <span>Создана:</span> {{ item.created_at }}
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

.post-card__title {

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
