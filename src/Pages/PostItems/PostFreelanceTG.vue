<script setup> import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";
import {useJobApplicationStore} from "@/stores/job_application.js";
import {computed} from "vue";
import {Head, usePage} from "@inertiajs/vue3";
import {useCandidateStore} from "@/stores/candidate.js";

const props = defineProps({
    item: Object | null,
    isFavoriteVacancy: Boolean | null,
    isCurrentUserIsAuthor: Boolean | null,
});

const page = usePage();
const userRole = page.props.auth.user?.mode;

const utilStore = useUtilsStore();
const jobApplicationStore = useJobApplicationStore();

const item = props.item;

const applyButtonDisabled = computed(() => jobApplicationStore.applyButtonDisabled ?? props.hasJobApplication);

const store = useCandidateStore();
store.isFavoriteVacancy = props.isFavoriteVacancy;

const toggleItem = () => {
    axios.patch(`/api/partner-items/${item.id}/toggle`);
};

</script>

<template>
    <Head title="Фриланс задача" />
    <AppLayout>
        <div class="post-card-tg">
            <div class="post-title-area">
                <h2 class="post-card__title">{{ item.title }}</h2>

                <div
                    @click="store?.toggleFavoriteVacancy(item.id)"
                    v-if="userRole !== 'company'"
                    :class="store?.isFavoriteVacancy ? 'post-item-star star-icon favorite' : 'post-item-star star-icon'"
                ></div>
            </div>

            <h3>Описание вакансии:</h3>

            <div  class="post-card__text"> {{ item.text }}</div>

            <p class="post-card__cost"><span>Оплата и стоимость: </span> {{ item.cost ?? 'Не указано' }}</p>

            <div class="post-card__footer">
                Опубликовано:
                <span class="post-card__date"> {{ utilStore.formatLocalTime(item.created_at) }}</span>
                <div class="vacancy-company">
                    Заказчик:
                    <div class="partner-name">{{ item?.company_name ?? 'Без названия' }}</div>
                </div>
            </div>

            <div class="source-link yellow-text"><span>Ссылка на источник объявления:</span> <u>
                <a
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer">
                    {{item.link}}
                </a>
            </u>
            </div>

            <button
                v-if="page.props?.is_admin"
                @click="toggleItem"
                class="toggle-button"
            >
                Toggle Enabled
            </button>

            <div class="post-item-note" v-if="userRole === undefined">
                <a href="/login">Войдите</a> или <a href="/register">Зарегистрируйтесь</a> чтобы опубликовать свою вакансию!
            </div>

            <form
                class="post-item-form"
                v-if="userRole === 'candidate' && !isCurrentUserIsAuthor"
                @submit.prevent="(e) => jobApplicationStore.applyJobApplication(e)"
            >
                <input type="hidden" name="itemId" :value="item.id">
                <input
                    type="submit"
                    value="Отликнуться"
                    :disabled="applyButtonDisabled"
                    :class="{ disabled: applyButtonDisabled }"
                >
            </form>
        </div>

    </AppLayout>
</template>

<style scoped>
.post-card-tg {
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
