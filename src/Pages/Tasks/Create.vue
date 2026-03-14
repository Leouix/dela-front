<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {onMounted, onUnmounted, ref} from "vue";
import RichEditor from "@/components/RichEditor.vue";
import {useCreateTaskStore} from "@/stores/createTask.js";
import Multiselect from "vue-multiselect";
import TaskDocuments from "@/components/TaskDocuments.vue";
import {Head} from "@inertiajs/vue3";

const props = defineProps({
    isCompanyFilled: Boolean,
    noFilledFields: Array,
});

const store = useCreateTaskStore();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const tipActive = ref(false);

function toggleTooltip() {
    tipActive.value = !tipActive.value
}

function handleClickOutside(e) {
    const infoIcon = e.target.closest('.info-icon');
    if (!infoIcon && tipActive.value) {
        tipActive.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});


const emailsArrayRef = ref([]);

const validateEmails = () => {
    return emailsArrayRef.value.every(email => emailPattern.test(email));
};

function submitForm(e) {
    if (store.task.is_personal && !validateEmails()) {
        emailError.value = true;
        return;
    }
    store.create(emailsArrayRef);
}


const emailError = ref(false);

const addEmail = (newEmail) => {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(newEmail)) {
        emailsArrayRef.value.push(newEmail);
        emailError.value = false;
    } else {
        emailError.value = true;
    }
}

function handleAddDocuments(e) {
    store.addDocuments(e);
}

function handleDeleteDocument(document) {

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
    <Head title="Создать задачу" />
    <AppLayout>

        <div class="create-form-container">

            <div v-show="!props.isCompanyFilled" class="note-fill-about-company">
                Перед публикацией задачи необходимо <a :href="route('company.dashboard')">заполнить информацию о компании</a>
                <div class="fields">
                    (<span v-for="field in props.noFilledFields">
                    "{{field}}"
                </span>)
                </div>
            </div>

            <h1 class="form-title">Создать задачу</h1>

            <form id="create-vacancy-form" @submit.prevent="submitForm($event, { emailsArrayRef })" method="post" enctype="multipart/form-data" class="create-form dbb-form">
                <div class="form-group">
                    <label for="title" class="form-label">Заголовок</label>
                    <input
                        v-model="store.task.title"
                        type="text"
                        id="title"
                        name="title"
                        class="form-input"
                        maxlength="255"
                        required
                    >
                </div>

                <RichEditor v-model="store.task.text" />

                <div class="form-group">
                    <label for="cost" class="form-label">Оплата и стоимость в USDT</label>
                    <input
                        v-model="store.task.cost"
                        type="number"
                        id="cost"
                        name="cost"
                        class="form-input"
                        min="1"
                        required
                    >
                </div>

                <TaskDocuments
                    :documents="store.task?.documents"
                    :added-documents="store.addedDocuments"
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
                />

                <div v-if="emailError" class="error-message">
                    Некорректный Email
                </div>

                <div class="form-group">
                    <label for="post_status" class="form-label">Статус публикации</label>
                    <select
                        id="post_status"
                        name="post_status"
                        v-model="store.task.status"
                        class="form-select"
                    >
                        <option value="draft">Черновик</option>
                        <option value="publish">Опубликовать (после модерации)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="deadline" class="form-label">Дедлайн по задаче</label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        v-model="store.task.deadline"
                        :min="store.tomorrow"
                        class="form-input-deadline"
                    >
                    <div class="text-gray-600 italic">
                        {{ store.formattedDeadline }}
                    </div>
                </div>

                <button type="submit" class="submit-button">Сохранить задачу</button>
            </form>

        </div>

    </AppLayout>
</template>


<style scoped>
.create-form-container {

    margin: 0 auto;


    @media screen and (min-width: 769px) {
        padding: 20px;
    }
}

.form-title {
    font-size: 24px;
    margin-bottom: 20px;
}

.create-form {
    border-radius: 5px;

    @media screen and (min-width: 769px) {
        padding: 20px;
    }
}

.form-group {}
.form-label {}
.form-textarea {}
.submit-button {}

.form-input-deadline {
    max-width: 100%;
}

.documents-area {
    margin: 25px 0;

    .documents {
        p {
            font-size: 16px;
            text-decoration: underline;

            span {
                cursor: pointer;

                img {
                    width: 15px;
                    height: 15px;
                    display: inline-block;
                    margin: 0 5px;
                }
            }
        }
    }
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




</style>
