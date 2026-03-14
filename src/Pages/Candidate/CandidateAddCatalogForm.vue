<script setup>
import RichEditor from "@/components/RichEditor.vue";
import {useAddCandidateStore} from "@/stores/addMaster.js";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {watchDebounced} from '@vueuse/core'
import Multiselect from "vue-multiselect";

const props = defineProps({
    candidate: Object|null,
});

const store = useAddCandidateStore();

const addLanguage = () => {
    store.candidateDto.languages.push({ language: '', level: '' })
}

const removeLanguage = (index) => {
    store.candidateDto.languages.splice(index, 1)
}

const adding_error = ref(true);
const query_adding_error = ref(false);
const fieldsetDisabled = ref(true);
const loading = ref(false);
const success = ref(false);
const isOpen = ref(false);

watchDebounced(
    () => store.candidateDto.newEmail,
    async (newEmail) => {

        success.value = false
        fieldsetDisabled.value = true

        if (!newEmail) return

        if (!newEmail.includes('@')) {
            query_adding_error.value = false
            return
        }

        loading.value = true

        const { data } = await axios.post('/api/check-email', { email: newEmail })
        const exists = !!data.exists

        if (exists === false) {
            isOpen.value = true
            fieldsetDisabled.value = false
        }

        success.value = !exists
        query_adding_error.value = exists

        loading.value = false
    },
    { debounce: 600 }
)

const toggleIsOpen = () => {
    isOpen.value = !isOpen.value
}

const isEmptyField = computed(() => {
    return !store.candidateDto.newEmail?.trim()
});

onMounted(() => {
    store.getCategories()
    store.getLanguages()
})

</script>

<template>

    <div class="avatar">
        <img
            id="candidate-avatar"
            class="avatar"
            :src="store.getAvatarUrl"
            alt="candidate avatar"
        />

        <div class="form-control-wrapper">
            <input
                type="file"
                class="form-control"
                v-on:change="store.uploadImage($event)"
                name="avatar"
            >
            <button class="del-avatar-button" @click.prevent="store.deleteImage">Удалить изображение</button>
        </div>
    </div>

    <form class="candidate-info" @submit.prevent="store.addNewMaster($event, adding_error)" >

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

        <h4>Email нового Мастера</h4>
            <div class="form-group email-group col">

                <div class="input-wrapper">

                    <input type="email" id="newEmail" name="newEmail" v-model="store.candidateDto.newEmail" placeholder="Укажите email"/>
                    <div class="min-width">
                        <span v-if="loading" class="loader"></span>
                        <span v-if="success" class="success"></span>
                    </div>

                </div>
                <span v-if="query_adding_error" class="email-error">Такой email уже существует</span>
                <span v-if="isEmptyField" class="email-warning">Укажите электронный адрес</span>
            </div>

        <div class="toggle-area">
            <div
                :class="['spoiler', isOpen ? 'spoiler-opened' : 'spoiler-closed']"
                @click="toggleIsOpen"
            >
            </div>

        </div>

        <transition name="collapse">
            <fieldset v-if="isOpen" :disabled="fieldsetDisabled || store.formLoading">

            <div class="form-group">
                <label for="name">Имя:</label>
                <input type="text" id="name" name="name" v-model="store.candidateDto.name" />
            </div>

            <div class="form-group required">
                <label for="profession" >Профессия:</label>
                <input type="text" id="profession" name="profession" v-model="store.candidateDto.profession" required />
            </div>

            <div class="form-group">
                <label for="experience">Сколько лет опыта:</label>
                <input type="number" id="experience" name="experience" v-model="store.candidateDto.experience" min="0" max="100"/>
            </div>


            <div class="form-group">
                <label for="age">Возраст:</label>
                <input type="number" id="age" name="age" v-model="store.candidateDto.age" max="150" min="1"/>
            </div>

            <div class="form-group">
                <label for="gender">Пол:</label>
                <select id="gender" name="gender" v-model="store.candidateDto.gender">
                    <option value="">Не выбрано</option>
                    <option value="М">М</option>
                    <option value="Ж">Ж</option>
                    <option value="Другое">Другое</option>
                </select>
            </div>

            <div class="form-group">
                <label for="form_job">Форма работы:</label>
                <select id="form_job" name="form_job" v-model="store.candidateDto.form_job">
                    <option value="">Не выбрано</option>
                    <option value="Полный день">Полный день</option>
                    <option value="Частичная занятость">Частичная занятость</option>
                    <option value="Проектная работа">Проектная работа</option>
                </select>
            </div>

            <div class="form-group">
                <label for="salary">Желаемый уровень ЗП:</label>
                <input type="text" id="salary" name="salary" v-model="store.candidateDto.salary" />
            </div>

            <div class="form-group">
                <label>Языки, которым владеете:</label>
                <div class="language-rows">
                    <div v-for="(lang, index) in store.candidateDto.languages" :key="lang.id" class="language-row">
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

            <RichEditor v-model="store.candidateDto.about" typeEditor="add_catalog"/>

            <input type="submit" id="save-candidate" value="Добавить" class="save-candidate-profile">

        </fieldset>
    </transition>

    </form>

    <div id="save-error" v-if="store.saveError">
        {{store.saveError}}
    </div>

</template>

<style scoped>
fieldset {
    border: 1px solid #978d3733;

    &:disabled {
        opacity: 0.5;
    }
}

.form-group {
    position: relative;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
}

.email-error {
    font-size: 12px;
    color: #ff6b6b;
    margin-top: 2px;
}

.email-warning {
    color: #cb7808;
    font-size: 12px;
    margin-top: 2px;
}

.loader {
    background: url('/images/icons/blendertimer-load.gif') no-repeat;
    width: 25px;
    height: 25px;
    background-size: cover;
    position: absolute;
    left: -35px;
    top: 5px;
}

.success {
    background: url('/images/icons/checkmark-2.svg') no-repeat;
    width: 25px;
    height: 25px;
    background-size: cover;
    display: inline-block;
}

input::placeholder {
    font-size: 14px;
}

.collapse-enter-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.collapse-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}
.spoiler {
    cursor: pointer;
}
.spoiler-opened {
    opacity: 0.9;
    background: url('/images/icons/right-arrow 1.svg') no-repeat;
    background-size: cover;
    transform: rotate(90deg);
    width: 20px;
    height: 20px;
}


.spoiler-closed {
    opacity: 0.9;
    background: url('/images/icons/right-arrow 1.svg') no-repeat;
    transform: rotate(0deg);
    background-size: cover;
    width: 20px;
    height: 20px;
}

.toggle-area {
    display: block;
    margin: 15px 0;

}

.min-width {
    min-width: 25px;
}

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
