<script setup>
import RichEditor from "@/components/RichEditor.vue";
import {usePage} from "@inertiajs/vue3";
import {useCandidateStore} from "@/stores/candidate.js";
import {onMounted} from "vue";
import Multiselect from "vue-multiselect";

const props = defineProps({
    candidate: Object | null,
});

const page = usePage();
const store = useCandidateStore();

const user = page.props.auth.user;
store.candidate = props.candidate;
store.selectedCategories = props.candidate.categories;

if (!store.candidate.languages) {
    store.candidate.languages = []
}

const addLanguage = () => {
    store.candidate.languages.push({ language: '', level: '' })
}

const removeLanguage = (index) => {
    store.candidate.languages.splice(index, 1)
}

onMounted(() => {
    store.getCategories()
    store.getLanguages()
})

</script>

<template>
    <picture class="avatar">
        <source v-bind:srcset="store.getAvatarUrl" type="image/webp">
        <source v-bind:srcset="store.getAvatarUrl" type="image/jpeg">
        <img id="candidate-avatar" class="avatar" v-bind:src="store.getAvatarUrl" alt="candidate avatar">
    </picture>

    <div class="form-control-wrapper">
        <input
            type="file"
            class="form-control"
            v-on:change="store.uploadImage($event, store.candidate.id)"
        >
        <button class="del-avatar-button" @click="store.deleteImage">Удалить изображение</button>
    </div>

    <div class="div-email">
        Email: {{ user.email }}
    </div>

    <multiselect
        v-model="store.selectedCategories"
        :options="store.categories"
        :multiple="true"
        placeholder="* Выберите одну или несколько категорий"
        track-by="name"
        label="name"
        :close-on-select="false"
        required
    >
    </multiselect>

    <form class="candidate-info" @submit.prevent="store.saveCandidate">

        <div class="form-group">
            <label for="name">Имя:</label>
            <input type="text" id="name" name="name" v-model="store.candidate.name"/>
        </div>

        <div class="form-group required">
            <label for="profession">Профессия:</label>
            <input type="text" id="profession" name="profession" v-model="store.candidate.profession"/>
        </div>

        <div class="form-group">
            <label for="experience">Сколько лет опыта:</label>
            <input type="number" id="experience" name="experience" v-model="store.candidate.experience" min="0"
                   max="100"/>
        </div>


        <div class="form-group">
            <label for="age">Возраст:</label>
            <input type="number" id="age" name="age" v-model="store.candidate.age" max="150" min="1"/>
        </div>

        <div class="form-group">
            <label for="gender">Пол:</label>
            <select id="gender" name="gender" v-model="store.candidate.gender">
                <option value="">Не выбрано</option>
                <option value="М">М</option>
                <option value="Ж">Ж</option>
                <option value="Другое">Другое</option>
            </select>
        </div>

        <div class="form-group">
            <label for="location">Местонахождение:</label>
            <input type="text" id="location" name="location" v-model="store.candidate.location"/>
        </div>

        <div class="form-group">
            <label for="form_job">Форма работы:</label>
            <select id="form_job" name="form_job" v-model="store.candidate.form_job">
                <option value="">Не выбрано</option>
                <option value="Полный день">Полный день</option>
                <option value="Частичная занятость">Частичная занятость</option>
                <option value="Проектная работа">Проектная работа</option>
            </select>
        </div>

        <div class="form-group">
            <label for="salary">Желаемый уровень ЗП:</label>
            <input type="text" id="salary" name="salary" v-model="store.candidate.salary"/>
        </div>

        <div class="form-group">
            <label>Языки, которым владеете:</label>
            <div class="language-rows">
                <div v-for="(lang, index) in store.candidate.languages" :key="lang.id" class="language-row">
                    <select :id="'language-select-' + index" v-model="lang.language" class="sm">
                        <option value="">Язык</option>
                        <option v-for="l in store.languages" :key="l.value" :value="l.value">
                            {{ l.label }}
                        </option>
                    </select>
                    <select :id="'language-level-' + index" v-model="lang.level" class="sm">
                        <option value="">Уровень владения</option>
                        <option v-for="level in store.languageLevels" :key="level.value" :value="level.value">
                            {{ level.label }}
                        </option>
                    </select>
                    <button type="button" @click="removeLanguage(index)" class="remove-lang-btn">×</button>
                </div>
            </div>

            <button type="button" @click="addLanguage" class="add-lang-btn">+ Добавить язык</button>
        </div>

        <h4>О себе, своем опыте:</h4>
        <input
            type="hidden"
            name="about"
            v-model="store.candidate.about"
        >

        <RichEditor v-model="store.candidate.about"/>

        <div class="form-checkbox">
            <input style="width: 15px; min-width: 15px;" id="add-catalog" type="checkbox" name="add_catalog" v-model="store.candidate.add_catalog">
            <label class="add-catalog" for="add-catalog">Добавить резюме в каталог Мастеров, чтобы Заказчики могли находить его для заказов</label>
        </div>

        <input type="submit" id="save-candidate" value="Сохранить профиль" class="save-candidate-profile">
    </form>

    <div id="save-error" v-if="store.saveError">
        {{ store.saveError }}
    </div>


</template>

<style scoped>

.language-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

.language-row select {
    flex: 1;
}

.remove-lang-btn {
    margin: 0;
    padding: 5px 15px;
}

.add-lang-btn {
    background: #4a90d9;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin: 5px 5px;
    min-width: 137px;
}

.required {
    label:after {
        content: "*";
        color: red;
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-left: 5px;
    }
}
</style>
