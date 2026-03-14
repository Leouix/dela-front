<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";

import axios from "axios";

const postItems = ref(null)

const utilsStore = useUtilsStore();

async function fetchData() {
    const response = await axios.post('/api/my/company/my-responses')
    postItems.value = response.data.postItems
}

onMounted(() => {
    fetchData()
})

</script>

<template>
    <AppLayout>

        <h1>Мои отклики</h1>
        <div v-for="item in (postItems ?? [])" :key="item?.id" class="item post-card">
            <div class="company">
                <h2 class="post-card__title">Название вакансии: <a :href="`/overview/vacancy/` + item.id">{{ item.title }}</a></h2>

                <div v-for="jobApplication in item.job_applications">
                    Мастера
                    <a :href="'/my/company/overview/candidate/' + jobApplication.user_candidate.id">
                        <div>{{jobApplication.user_candidate.name}}</div>
                    </a>
                    <div class="post-card__footer">
                        <span class="post-card__date">Дата отклика: {{ utilsStore.formatLocalTime(jobApplication.created_at) }}</span>
                    </div>
                </div>

            </div>

        </div>
    </AppLayout>
</template>

<style scoped>

</style>
