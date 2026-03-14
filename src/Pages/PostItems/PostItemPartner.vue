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
    item: Object | null,
    isFavoriteVacancy: Boolean | null,
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

</script>

<template>
    <Head title="Вакансия" />
    <AppLayout>

        <div class="post-card">
            <div class="post-title-area">
                <h2 class="post-card__title">{{ item.title }}</h2>

                <div
                    @click="store?.toggleFavoriteVacancy(item.id)"
                    v-if="userRole !== 'company'"
                    :class="store?.isFavoriteVacancy ? 'post-item-star star-icon favorite' : 'post-item-star star-icon'"
                ></div>
            </div>

            <h3>Описание вакансии:</h3>
            <div v-html="item.text" class="post-card__text"></div>
            <p class="post-card__cost">Оплата и Стоимость: {{ item.cost }}</p>

            <div class="post-card__footer">
                Опубликовано:
                <span class="post-card__date"> {{ utilStore.formatLocalTime(item.created_at) }}</span>
                <div class="vacancy-company">
                    Заказчик:
                    <a
                        v-if="item.is_partner === 0"
                        :href="route('company.overview', { id: item.author.user_company.id })"
                    >
                        {{ item.company_partner_name }}
                    </a>
                    <div class="partner-name" v-else>{{ item.company_partner_name }}</div>
                </div>
            </div>

            <div class="source-link yellow-text"><span>Ссылка на источник объявления:</span> <u><a :href="item.url" target="_blank" rel="noopener noreferrer">{{item.url}}</a></u></div>

            <a :href="item.url" target="_blank" rel="noopener noreferrer" >
                <button>Откликнуться</button>
            </a>

            <div class="post-item-note" v-if="userRole === undefined">
                <a href="/login">Войдите</a> или <a href="/register">Зарегистрируйтесь</a> чтобы опубликовать свою вакансию!
            </div>


        </div>


        <job-applications v-if="userRole === 'company' && isCurrentUserIsAuthor"/>

    </AppLayout>
</template>

<style scoped>
.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.source-link {
    margin: 10px 0;
}

.post-card {
    width: 100%;
    max-width: 920px;
    font-size: 18px;
    .post-card__text {
        white-space: pre-line;
        font-size: 18px;
        line-height: 1.5;
    }


    .post-card__cost {
        margin: 10px 0;
        span {
            color: #B77431;
        }

    }
}
.yellow-text {
    margin: 10px 0;
    span {
        color: #B77431;
    }

}
.source-link {
    a {
        font-size: 16px;
    }

}

</style>
