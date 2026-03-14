<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {useCreatePostItemStore} from "@/stores/createPostItem.js";
import {ref} from "vue";
import RichEditor from "@/components/RichEditor.vue";


const props = defineProps({
    isCompanyFilled: Boolean,
    noFilledFields: Array,
});

const store = useCreatePostItemStore();
const status = ref('draft');
const text = ref('');

</script>


<template>
    
    <AppLayout>

        <div class="create-form-container">

            <div v-show="!props.isCompanyFilled" class="note-fill-about-company">
                Перед публикацией вакансии необходимо <a :href="route('company.dashboard')">заполнить информацию о компании</a>
                <div class="fields">
                   (<span v-for="field in props.noFilledFields">
                    "{{field}}"
                </span>)
               </div>
            </div>

            <h1 class="form-title">Создать вакансию</h1>

            <form id="create-vacancy-form" @submit.prevent="store.createPartner" method="post" enctype="multipart/form-data" class="create-form dbb-form">
                <div class="form-group">
                    <label for="title" class="form-label">Заголовок</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        class="form-input"
                        maxlength="255"
                    >
                </div>

                <input
                    type="hidden"
                    name="text"
                    v-model="text"
                >
                <RichEditor v-model="text" />

                <div class="form-group">
                    <label for="cost" class="form-label">Оплата и стоимость</label>
                    <input
                        type="text"
                        id="cost"
                        name="cost"
                        class="form-input"
                        maxlength="255"
                    >
                </div>

                <div class="form-group">
                    <label for="company_partner_name" class="form-label">Название компании Нанимателя</label>
                    <input
                        type="text"
                        id="company_partner_name"
                        name="company_partner_name"
                        class="form-input"
                        maxlength="255"
                        required
                    >
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
                    </select>
                </div>

                <div class="form-group">
                    <label for="partner-message" class="form-label">Партнерское сообщение Мастеру</label>
                    <textarea
                        id="partner-message"
                        name="partner_message"
                        class="form-textarea"
                    ></textarea>
                </div>

                <button type="submit" class="submit-button">Сохранить объявление</button>
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
.form-select {}
.submit-button {}

</style>
