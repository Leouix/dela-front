<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {useEditCompanyProfileStore} from "@/stores/editCompanyProfile.js";
import ResponsiveNavLink from "@/components/ResponsiveNavLink.vue";
import {Head, Link} from "@inertiajs/vue3";

const props = defineProps({
    company: Object,
    isCompanyFilled: Boolean,
    noFilledFields: Array,
    customerStatistic: Object|null,
});

const store = useEditCompanyProfileStore();

store.company = props.company;

</script>

<template>
    <Head title="Мой Профиль" />
    <AppLayout>

        <div v-show="!props.isCompanyFilled" class="note-fill-about-company">
            Для того, чтобы опубликовать вакансию необходимо <a :href="route('company.dashboard')">заполнить информацию о компании</a>
            <div class="fields">
                (<span v-for="field in props.noFilledFields">
                    "{{field}}"
                </span>)
            </div>
        </div>

        <div class="edit-form-container">

            <h1 class="form-title">Профиль компании</h1>

            <div class="preview-company-profile">
                Публичная страница: <a :href="'/overview/company-profile/' + store.company.slug">{{store.company.title}}</a>
            </div>

            <div class="email-company">Email: {{store.company.user.email}}</div>
            <form id="edit-company-form" @submit.prevent="store.edit" method="post" enctype="multipart/form-data" class="edit-form dbb-form">
                <div class="form-group">
                    <label for="title" class="form-label">Название компании</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        class="form-input"
                        maxlength="255"
                        v-model="store.company.title"
                        required
                    >
                </div>

                <div class="form-group form-group-image">
                    <label for="image" class="form-label">Изображение компании</label>

                    <img v-show="store.company?.image?.url" :src="store.company?.image?.url" class="image-preview" alt="image-preview">

                    <input
                        type="file"
                        id="image"
                        name="image"
                        class="form-input"
                        @change="store.onChangeImage"
                        accept="image/*"
                    >
                    <div class="del-avatar-button" @click="store.deleteImage">Удалить изображение</div>
                </div>

                <div class="form-group">
                    <label for="description" class="form-label">Описание</label>
                    <textarea
                        id="description"
                        name="description"
                        class="form-textarea"
                        v-model="store.company.description"
                        required
                    ></textarea>
                </div>

                <div class="form-group">
                    <label for="location" class="form-label">Местоположение компании</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        class="form-input"
                        maxlength="255"
                        v-model="store.company.location"
                    >
                </div>

                <div class="form-group">
                    <label for="count_position_type" class="form-label">Количество сотрудников</label>
                    <select
                        id="count_position_type"
                        name="count_position_type"
                        class="form-select"
                        v-model="store.company.count_position_type_id"
                        required
                    >
                        <option value="1">1-10</option>
                        <option value="2">11-50</option>
                        <option value="3">50-100</option>
                        <option value="4">более 100</option>
                    </select>
                </div>

                <button type="submit" class="submit-button">Сохранить</button>
            </form>

            <div class="customer-statistic-area">
                <h4>Статистика компании:</h4>
                <div class="customer-statistic">
                    <div v-for="(value, name, index) in customerStatistic.data" :key="index" :class="value.class">
                        <div>{{ name }}:</div> <div>{{ value.value }}</div>
                    </div>
                </div>
            </div>

            <hr>
            <div class="manage-profile-area">
                <ResponsiveNavLink :href="route('profile.edit')" class="account-edit-link">Управление аккаунтом
                </ResponsiveNavLink>

                <Link
                    :href="route('logout')"
                    method="post"
                    as="button"
                >
                    Выйти
                </Link>
            </div>
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

.preview-company-profile {
    font-size: 14px;
    margin-bottom: 5px;
    a {
        text-decoration: underline;
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

.form-group-image {
    text-align: center;
    @media screen and (min-width: 920px) {
        text-align: inherit;
    }

    label {
        text-align: left;
    }

    .del-avatar-button {
        display: block;
        text-align: left;
    }
}
.form-label {}
.form-textarea {}
.submit-button {}

.image-preview {
    width: 100%;
    border-radius: 4px;
    box-shadow: 1px 1px 3px #ffffff63;
    margin: 15px auto;

    @media screen and (min-width: 450px) {
        max-width: 400px;
    }
}

.email-company {
    font-size: 14px;
    margin-bottom: 10px;
}
</style>
