<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {computed, onMounted, onUnmounted, ref} from "vue";
import RichEditor from "@/components/RichEditor.vue";
import {useEditTaskStore} from "@/stores/editTask.js";
import Multiselect from "vue-multiselect";
import TaskDocuments from "@/components/TaskDocuments.vue";
import {Head} from "@inertiajs/vue3";

const props = defineProps({
    task: Object,
    isCompanyFilled: Boolean,
    noFilledFields: Array,
});

const store = useEditTaskStore();

store.task = props.task;

const status = ref(store.task.post_status);
const title = ref(store.task.title);
const text = ref(store.task.text);
const cost = ref(store.task.cost);
const deadline = ref(store.task.deadline ? store.task.deadline.split(' ')[0] : null);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailsArrayRef = ref(
    store.task.personal_members ?? []
);

const validateEmails = () => {
    return emailsArrayRef.value.every(email => emailPattern.test(email));
};

function submitForm(e) {
    if (store.task.is_personal && !validateEmails()) {
        emailError.value = true;
        return;
    }
    store.edit(e, { emailsArrayRef, text });
}

const formattedDeadline = computed(() => {
    if (!deadline.value) return ''

    const date = new Date(deadline.value)
    return date.toLocaleDateString('ru-RU', {
        weekday: 'long',   // день недели
        year: 'numeric',
        month: 'long',     // полный месяц
        day: 'numeric'
    })
})

const canEdit = !store.task.has_task_applications;

const tipActive = ref(false);
const emailError = ref(false);

function toggleTooltip() {
    tipActive.value = !tipActive.value
}

const addEmail = (newEmail) => {
    if (emailPattern.test(newEmail)) {
        emailsArrayRef.value.push(newEmail);
        emailError.value = false;
    } else {
        emailError.value = true;
    }
}

function handleClickOutside(e) {
    const infoIcon = e.target.closest('.info-icon');
    if (!infoIcon && tipActive.value) {
        tipActive.value = false;
    }
}



const imageExt = ['png', 'jpg', 'jpeg', 'webp', 'gif']
const textExt = ['txt', 'xml', 'json']

function getExtension(path) {
    const { pathname } = new URL(path, window.location.origin)
    return pathname.split('.').pop().toLowerCase()
}

function getFileType(path) {
    const ext = getExtension(path)

    if (imageExt.includes(ext)) return 'image'
    return 'file'
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

function handleAddDocuments(e) {
    store.addDocuments(e);
}

function handleDeleteDocument(document) {
    store.deleteDocument(document);
}

function handleDeleteAddedDocument(document) {
    store.deleteAddedDocument(document);
}

function togglePersonalEmails() {
    if (store.emailSuggestions === null) {
        store.getPersonalMembers()
    }
}


</script>


<template>

    <Head title="Редактировать задачу" />
    <AppLayout>

        <div class="edit-form-container">

            <div v-show="!props.isCompanyFilled" class="note-fill-about-company">
                Перед публикацией задачи необходимо <a :href="route('company.dashboard')">заполнить информацию о компании</a>
                <div class="fields">
                    (<span v-for="field in props.noFilledFields">
                    "{{field}}"
                </span>)
                </div>
            </div>


            <div class="task-tool">
                <div class="task-duplicate" @click="store.duplicate()" title="Дублировать задачу"><img
                    src="/images/icons/duplicate.svg"
                    alt="duplicate"></div>
            </div>
            <h1 class="form-title">Редактировать задачу</h1>

            <span v-if="store.task.has_task_applications" class="not-editable notice">Некоторые поля нельзя редактировать, т.к. у задачи есть отклики</span>

            <form id="edit-vacancy-form" @submit.prevent="submitForm($event, { emailsArrayRef, text })" class="edit-form dbb-form">
                <div class="form-group">
                    <label for="title" class="form-label">Заголовок</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        class="form-input"
                        maxlength="255"
                        v-model="title"
                        :disabled="!canEdit"
                        required
                    >
                </div>

                <RichEditor v-if="canEdit" v-model="text" />
                <p class="rich-editor-disabled" v-else v-html="text"></p>

                <div class="form-group">
                    <label for="cost" class="form-label">Оплата и стоимость в USDT</label>
                    <input
                        type="number"
                        id="cost"
                        name="cost"
                        class="form-input"
                        min="0"
                        max="5000"
                        maxlength="255"
                        v-model="cost"
                        :disabled="!canEdit"
                    >
                </div>

                <TaskDocuments
                    :documents="store.task.documents"
                    :added-documents="store.addedDocuments"
                    :can-edit="canEdit"
                    @add-documents="handleAddDocuments"
                    @delete-document="handleDeleteDocument"
                    @delete-added-document="handleDeleteAddedDocument"
                />


                <div class="checkbox-input-group">
                    <label for="is-personal">Персональная задача</label>
                    <input
                        v-model="store.task.is_personal"
                        type="checkbox"
                        id="is-personal"
                        name="is_personal"
                        @change="togglePersonalEmails"
                    >
                    <div class="info-icon" @click="toggleTooltip">
                        <div class="tip" :class="{ active: tipActive }">
                            Персональные задачи видны только указанным вами пользователям
                        </div>
                    </div>
                </div>

                <Multiselect
                    v-if="store.task.is_personal"
                    v-model="emailsArrayRef"
                    :options="store.emailSuggestions || []"
                    :multiple="true"
                    :taggable="true"
                    tag-placeholder="Добавить email"
                    placeholder="Введите email"
                    @tag="addEmail"
                >
                </Multiselect>

                <div v-if="emailError" class="error-message">
                    Некорректный Email
                </div>

                <div class="form-group">
                    <label for="post_status" class="form-label">Статус публикации</label>
                    <select
                        id="post_status"
                        name="post_status"
                        v-model="status"
                        class="form-select"
                    >
                        <option value="draft">Черновик</option>
                        <option value="publish">Опубликовать (после модерации)</option>
                        <option value="archive">Архив</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="deadline" class="form-label">Дэдлайн по задаче</label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        v-model="deadline"
                        :min="store.tomorrow"
                        class="form-input-deadline"
                        :disabled="!canEdit"
                    >
                    <div class="text-gray-600 italic">
                        {{ formattedDeadline }}
                    </div>
                </div>

                <input type="hidden" name="task_id" :value="store.task.id">

                <button type="submit" class="submit-button">Сохранить задачу</button>
            </form>


        </div>

    </AppLayout>

</template>


<style scoped>
.edit-form-container {

    margin: 0 auto;


    @media screen and (min-width: 769px) {
        padding: 20px;
    }
}

.form-title {
    font-size: 24px;
    margin-bottom: 20px;
}

.edit-form {
    border-radius: 5px;

    @media screen and (min-width: 769px) {
        padding: 20px;
    }
}

.form-group {}
.form-label {}
.form-textarea {}
.form-select {}
.submit-button {}

.form-input-deadline {
    max-width: 100%;
}

.list-documents {
    list-style: none;
    li {
        display: flex;
        gap: 15px;
        margin-top: 15px;
    }
    .delete-document {
        margin-left: 15px;
        cursor: pointer;
    }
}

.rich-editor-disabled {
    padding: 15px;
    background: #5b5b5b;
    border-radius: 4px;
    margin: 0;
    margin-bottom: 10px;
}

span.not-editable.notice {
    font-size: 14px;
    color: #eea41b;
}

input:disabled {
    opacity: 0.3;
}


.checkbox-input-group {
    margin: 25px 0;
    display: flex;
    align-items: center;

    input[type="checkbox"] {
        margin: 0 10px;
    }
}

.multiselect {
    margin: 15px 0 25px;
}

.multiselect-wrapper {
    margin: 15px 0 25px;
}

/* Убираем лишний маржин у самого мультиселекта, если он внутри обертки */
.multiselect-wrapper .multiselect {
    margin: 0;
}

.task-tool {
    float: right;
    .task-duplicate {
        width: 20px;
        height: 20px;
        opacity: 0.8;
        cursor: pointer;
    }
}

</style>
