<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {onMounted, ref} from "vue";
import {useEditPostItemStore} from "@/stores/editPostItem.js";
import RichEditor from "@/components/RichEditor.vue";


const props = defineProps({
    userRole: String|null,
    postItem: Object|null,
    isCompanyFilled: Boolean,
    noFilledFields: Array,
});

const store = useEditPostItemStore();
const post_status = ref(props.postItem.post_status);
const title = ref(props.postItem.title);
const text = ref(props.postItem.text);
const cost = ref(props.postItem.cost);
const partner_message = ref(props.postItem.partner_message);
const company_partner_name = ref(props.postItem.company_partner_name);


onMounted(() => {
    store.setPostItemId(props.postItem.id);
})

</script>


<template>
    
    <AppLayout>

        <div v-show="!props.isCompanyFilled" class="note-fill-about-company">
            Для того, чтобы вакансия была опубликована, необходимо <a :href="route('company.dashboard')">заполнить информацию о компании</a>
            <div class="fields">
                (<span v-for="field in props.noFilledFields">
                    "{{field}}"
                </span>)
            </div>
        </div>

        <div class="edit-form-container">
            <h1 class="form-title">Просмотр и редактирование вакансии</h1>

            <form id="edit-vacancy-form" @submit.prevent="store.editPartner" method="post" enctype="multipart/form-data" class="edit-form  dbb-form">
                <div class="form-group">
                    <label for="title" class="form-label">Заголовок</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        class="form-input"
                        maxlength="255"
                        v-model="title"
                    >
                </div>

                <input
                    type="hidden"
                    name="text"
                    v-model="text"
                >
                <RichEditor v-model="text" />


                <div class="form-group">
                    <label for="company_partner_name" class="form-label">Название компании Нанимателя</label>
                    <input
                        type="text"
                        id="company_partner_name"
                        name="company_partner_name"
                        class="form-input"
                        maxlength="255"
                        required
                        v-model="company_partner_name"
                    >
                </div>

                <div class="form-group">
                    <label for="partner-message" class="form-label">Партнерское сообщение Мастеру:</label>
                    <textarea
                        id="partner-message"
                        name="partner_message"
                        class="form-textarea"
                        v-model="partner_message"
                    ></textarea>
                </div>

                <div class="form-group">
                    <label for="cost" class="form-label">Оплата и стоимость</label>
                    <input
                        type="text"
                        id="cost"
                        name="cost"
                        class="form-input"
                        maxlength="255"
                        v-model="cost"
                    >
                </div>

                <div class="form-group">
                    <label for="post_status" class="form-label">Статус публикации</label>
                    <select
                        id="post_status"
                        name="post_status"
                        v-model="post_status"
                        class="form-select"
                    >
                        <option value="draft">Черновик</option>
                        <option value="publish">Опубликовать (после модерации)</option>
                    </select>
                </div>

                <input type="hidden" name="post_item_id" :value="props.postItem.id">

                <button type="submit" class="submit-button">Сохранить объявление</button>
            </form>
        </div>


    </AppLayout>
</template>

<style scoped>
.edit-form-container {

    margin: 0 auto;
    padding: 20px;
}

.form-title {
    font-size: 24px;
    margin-bottom: 20px;
}

.edit-form {
    padding: 20px;
    border-radius: 5px;
}

.form-group {}
.form-label {}
.form-textarea {}
.form-select {}
.submit-button {}

</style>
