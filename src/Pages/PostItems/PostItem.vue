<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";
import {useJobApplicationStore} from "@/stores/job_application.js";
import {computed} from "vue";
import {Head, usePage} from "@inertiajs/vue3";
import {useCandidateStore} from "@/stores/candidate.js";

import JobApplications from "@/components/JobApplications.vue";
import {useDragNDropStore} from "@/stores/drag-n-drop.js";

const props = defineProps({
    postItem: Object | null,
    hasJobApplication: Boolean | null,
    isFavoriteVacancy: Boolean | null,
    jobApplications: Object | null,
    isCurrentUserIsAuthor: Boolean,
});

const page = usePage();
const userRole = page.props.auth.user?.mode;

const utilStore = useUtilsStore();
const jobApplicationStore = useJobApplicationStore();


const applyButtonDisabled = computed(() => jobApplicationStore.applyButtonDisabled ?? props.hasJobApplication);

const store = useCandidateStore();
store.isFavoriteVacancy = props.isFavoriteVacancy;

const dragNDropStore = useDragNDropStore();

dragNDropStore.items = props.jobApplications


const statuses = {
    publish: 'Опубликовано',
    draft: 'Черновик',
    archive: 'Архив',
};

const status = statuses[props.postItem.post_status] ?? 'Неизвестный статус';

</script>

<template>
    <Head title="Вакансия" />
    <AppLayout>

        <div class="post-title-area">
            <h2 class="post-card__title">{{ postItem.title }}</h2>

            <div
                @click="store?.toggleFavoriteVacancy(postItem.id)"
                v-if="userRole !== 'company'"
                :class="store?.isFavoriteVacancy ? 'post-item-star star-icon favorite' : 'post-item-star star-icon'"
            ></div>
        </div>

        <b>Статус: </b>
        <span>{{status}}</span>

        <h3>Описание вакансии:</h3>
        <div v-html="postItem.text" class="post-card__text"></div>
        <p class="post-card__cost">Оплата и Стоимость: {{ postItem.cost }}</p>

        <div class="post-card__footer">
            Статус: <span></span>
            <span class="post-card__date"> {{ utilStore.formatLocalTime(postItem.created_at) }}</span>
            <div class="vacancy-company">
                Заказчик:
                <a
                    v-if="postItem.is_partner === 0"
                    :href="route('company.overview', { id: postItem.author.user_company.id })"
                >
                    {{ postItem.company_partner_name }}
                </a>
                <div class="partner-name" v-else>{{ postItem.company_partner_name }}</div>
            </div>
        </div>

        <div class="post-item-note" v-if="userRole === undefined">
            <a href="/login">Войдите</a> или <a href="/register">Зарегистрируйтесь</a> чтобы откликнуться на вакансию или опубликовать свою собственную!
        </div>

        <form
            class="post-item-form"
            v-if="userRole === 'candidate' && !isCurrentUserIsAuthor"
            @submit.prevent="(e) => jobApplicationStore.applyJobApplication(e)"
        >
            <input type="hidden" name="postItemId" :value="postItem.id">
            <input
                type="submit"
                value="Отликнуться"
                :disabled="applyButtonDisabled"
                :class="{ disabled: applyButtonDisabled }"
            >
        </form>

        <job-applications v-if="userRole === 'company' && isCurrentUserIsAuthor"/>

    </AppLayout>
</template>

<style scoped>
.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}



</style>
