<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";
import {useTaskApplicationStore} from "@/stores/task_application.js";
import {computed} from "vue";
import {Head, usePage} from "@inertiajs/vue3";
import {useCandidateStore} from "@/stores/candidate.js";
import {useDragNDropStore} from "@/stores/drag-n-drop.js";
import TaskApplications from "@/components/TaskApplications.vue";
import {useTasksStore} from "@/stores/tasks.js";
import ShowTaskDocuments from "@/components/ShowTaskDocuments.vue";

const props = defineProps({
    task: Object | null,
    wasApplied: Boolean | null,
    isFavoriteTask: Boolean | null,
    taskApplications: Object | null,
    isCurrentUserIsAuthor: Boolean,
    currentCandidateBanned: Boolean | null,
});

const page = usePage();
const userRole = page.props.auth.user?.mode;

const utilStore = useUtilsStore();
const taskApplicationStore = useTaskApplicationStore();

const applyButtonDisabled = computed(() => taskApplicationStore.applyButtonDisabled ?? props.wasApplied);

const store = useCandidateStore();

store.isFavoriteVacancy = props.isFavoriteVacancy;

const dragNDropStore = useDragNDropStore();

dragNDropStore.items = props.taskApplications.data;

const canEdit = props.isCurrentUserIsAuthor && !props.taskApplications?.data.length > 0 && userRole === 'company';
const canApply = userRole === 'candidate' && !props.isCurrentUserIsAuthor && !props.currentCandidateBanned;
const taskStore = useTasksStore();
taskStore.isFavoriteTask = props.isFavoriteTask;

const statuses = {
    publish: 'Опубликовано',
    draft: 'Черновик',
    archive: 'Архив',
};

const status = statuses[props.task.post_status] ?? 'Неизвестный статус';
</script>

<template>

    <Head title="Задача" />
    <AppLayout>

        <a v-if="canEdit" :href="`/my/company/edit-task/` + task.slug" target="_blank" rel="noopener noreferrer" class="editable">
            <img src="/images/icons/edit.svg" alt="edit task">
            <div>Редактировать</div>
        </a>

        <div class="post-title-area">
            <h2 class="post-card__title">{{ task.title }}</h2>

            <div
                @click="taskStore.toggleFavorite(task.id)"
                v-if="userRole !== 'company'"
                :class="taskStore?.isFavoriteTask ? 'post-item-star star-icon favorite' : 'post-item-star star-icon'"
            ></div>
        </div>

        <b>Статус: </b>
        <span>{{status}}</span>

        <h3>Описание задачи:</h3>
        <div v-html="task.text" class="post-card__text"></div>
        <p class="post-card__cost">Оплата и стоимость в USDT: {{ task.cost }}</p>



        <h4>Приложения к задаче: </h4>
        <ShowTaskDocuments :documents="task.documents"/>

        <div class="post-card__footer">

            <div class="footer-card-date">Опубликовано:
                <span class="post-card__date"> {{ utilStore.formatLocalTime(task.created_at) }}</span>
            </div>
            <div class="footer-card-date">Дедлайн:
                <span class="post-card__date">{{ utilStore.formatLocalTime(task.deadline) }}</span>
            </div>


            <div class="vacancy-company">
                Заказчик:
                <a
                    :href="route('company.overview', { id: task.author.user_company.slug })"
                >
                    {{ task.author.user_company.title }}
                </a>
            </div>
        </div>

        <div class="post-item-note" v-if="userRole === undefined">
            <a href="/login">Войдите</a> или <a href="/register">Зарегистрируйтесь</a> чтобы откликнуться на задачу или опубликовать свою собственную!
        </div>

        <form
            class="post-item-form"
            v-if="canApply"
            @submit.prevent="(e) => taskApplicationStore.applyTaskApplication(e)"
        >
            <input type="hidden" name="taskId" :value="task.id">
            <input
                type="submit"
                value="Отликнуться"
                :disabled="applyButtonDisabled"
                :class="{ disabled: applyButtonDisabled }"
            >
        </form>

        <task-applications v-if="isCurrentUserIsAuthor && userRole === 'company'" />

    </AppLayout>
</template>

<style scoped>

.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.post-item-form {
    margin: 15px 0;


    input[type="submit"] {
        background: #ad6644d6;
        padding: 10px 45px;
    }
}

</style>
