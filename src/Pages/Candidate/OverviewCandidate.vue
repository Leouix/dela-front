<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {useCandidateStore} from "@/stores/candidate.js";
import {ref} from "vue";
import {Head, usePage} from "@inertiajs/vue3";
import {useChatStore} from "@/stores/chatStore.js";

const props = defineProps({
    'candidate': Object,
    'isFavorite': Boolean | null,
    'notes': Object | null,
    'specialistStatistic': Object | null,
    'ban': Object,
    'taskOrderInWorkSlugs': Object | null,
});

const store = useCandidateStore();

store.candidate = props.candidate;
store.isFavorite = props.isFavorite;
store.notes = props.notes;

const action = ref('');
const isBanned = ref(props.ban.isBanned);
const reason = ref();

const page = usePage();
const user = page.props.auth?.user;

const applyAction = (e) => {
    if (!canBlock) {
        return;
    }
    const form = new FormData(e.target)
    axios.post('/api/apply-candidate-actions', form)
}

function changeActions(e) {
    action.value = e.target.value

    if (action.value !== 'ban') {
        reason.value = ''
    }
}

const canBlock = props.taskOrderInWorkSlugs.length === 0;

const isMyselfProfile = page.props.auth?.user?.id ? page.props.auth?.user?.id === props.candidate.user?.id : false;

function getLangName(language, index) {
    if (index === 0) {
        return language.language_label + ' · ' + language.level_label;
    }
    else {
        return ', ' + language.language_label + ' · ' + language.level_label;
    }
}

function getCatName(category, index) {
    if (index === 0) {
        return category.name;
    }
    else {
        return ', ' + category.name;
    }
}
const chatStore = useChatStore();
const startDialog = async () => {
    await axios.post('/api/start-dialog', {
        user_candidate_id: props.candidate.id,
    }).then(response => {
        if (response.data) {
            chatStore.openDialog(response.data.dialog);
        }
    })
}
</script>

<template>
    <Head title="Профиль мастера"/>
    <AppLayout>

        <div class="page content candidate-page">

            <h1>Профиль мастера:</h1>

            <div class="candidate-card">

                <picture class="avatar">
                    <source v-bind:srcset="store.getAvatarUrl" type="image/webp">
                    <source v-bind:srcset="store.getAvatarUrl" type="image/jpeg">
                    <img id="candidate-avatar" class="avatar" v-bind:src="store.getAvatarUrl" alt="candidate avatar">
                </picture>

                <div v-if="!isMyselfProfile" @click="store.toggleFavorite"
                     v-bind:class="store.isFavorite ? 'star-icon favorite' : 'star-icon'"></div>

                <p>Категории:</p>
                <div class="flex gap-2 flex-wrap">
                      <span
                          v-for="(category, i) in props.candidate.categories"
                          :key="i"
                      >
                       {{ getCatName(category, i) }}
                      </span>
                </div>

                <div class="candidate-info">
                    <p>Имя: <span>{{ props.candidate.name }}</span></p>
                    <p>Возраст: <span>{{ props.candidate.age }}</span></p>
                    <p>Пол: <span>{{ props.candidate.gender }}</span></p>
                    <p>Профессия: <span>{{ props.candidate.profession }}</span></p>
                    <p>Лет опыта: <span>{{ props.candidate.experience }}</span></p>
                    <p>Форма работы: <span>{{ props.candidate.form_job }}</span></p>

                    <p>Языки:</p>
                    <div class="flex gap-2 flex-wrap">
                      <span
                          v-for="(language, i) in props.candidate.languages"
                          :key="i"
                      >
                        {{ getLangName(language, i) }}
                      </span>
                    </div>

                    <p>Желаемый уровень ЗП: <span>{{ props.candidate.salary }}</span></p>
                    <p>О себе: <span v-html="props.candidate.about"></span></p>
                </div>

            </div>

            <button v-if="user" @click="startDialog">Написать специалисту</button>

            <section v-if="!isMyselfProfile" id="notes">
                <h4>Ваши заметки (видны только Вам):</h4>
                <form id="form-notes" @submit.prevent="store.createNote" enctype="text/plain">

                    <textarea name="text" id="text-note" rows="10"></textarea>
                    <input name="candidate_id" type="hidden" v-bind:value="store.candidate.id">
                    <div class="button-area">
                        <input type="submit">
                    </div>


                    <div
                        class="notes-items"
                        v-for="note in store.notes"
                        :key="note.id"
                    >
                        <div class="note-item">
                            <div class="note-row">
                                <div
                                    :id="'note-item-dt-' + note.id" class="date-time"
                                    :contenteditable="store.datetimeEditables[note.id]"
                                >
                                    {{ note.custom_date ?? note.updated_at }}
                                </div>
                                <div class="actions">
                                    <div class="action">
                                        <div
                                            @click="store.editDatetime(note.id)"
                                            :class="store.datetimeEditables[note.id] ? 'action-lock unlocked' : 'action-lock locked'"
                                        ></div>
                                        <div
                                            @click="store.editDatetime(note.id)"
                                        >edit Date Time
                                        </div>
                                    </div>
                                    <div class="action">
                                        <div
                                            @click="store.editTextNote(note.id)"
                                            :class="store.textEditableIds[note.id] ? 'action-lock unlocked' : 'action-lock locked'"
                                        ></div>
                                        <div
                                            @click="store.editTextNote(note.id)"
                                        >edit Text
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p
                                :id="'note-item-text-' + note.id"
                                class="text transition-selector"
                                :contenteditable="store.textEditableIds[note.id]"
                            >
                                {{ note.text }}
                            </p>

                            <div class="remove-note" @click="store.removeNote(note.id)">Remove</div>

                        </div>

                    </div>

                </form>

            </section>

            <div class="customer-statistic-area">
                <h4>Статистика задач Мастера:</h4>
                <div class="customer-statistic">
                    <div v-for="(value, name, index) in specialistStatistic.data" :key="index" :class="value.class">
                        <div>{{ name }}:</div>
                        <div>{{ value.value }}</div>
                    </div>
                </div>
            </div>

            <div v-if="!isMyselfProfile" class="actions-area">
                <div v-if="isBanned" class="is-banned">
                    <h4>Заблокирован</h4>
                    <p>Причина: {{ props.ban.reason ?? 'Не указано' }}</p>
                </div>

                <form @submit.prevent="applyAction">
                    <select
                        name="candidate_action"
                        @change="changeActions"
                        v-model="action"
                    >
                        <option value="" hidden>actions</option>
                        <option v-if="isBanned" value="unban">Разблокировать</option>
                        <option v-else value="ban">Заблокировать</option>
                    </select>

                    <textarea
                        v-if="action === 'ban' && canBlock"
                        v-model="reason"
                        name="reason"
                        cols="30"
                        rows="10"
                    ></textarea>

                    <input type="hidden" name="candidate_id" :value="props.candidate.id">

                    <div class="block-notice" v-if="action === 'ban' && !canBlock">
                        Вы не можете заблокировать пользователя, пока у него есть задача в работе.
                    </div>

                    <div class="block-notice" v-if="action === 'ban' && canBlock">
                        Вы не сможете общаться и взаимодействовать на платформе.
                    </div>

                    <button type="submit">Сохранить</button>
                </form>


            </div>


        </div>

    </AppLayout>
</template>

<style scoped>
.actions-area {
    width: 100%;
    display: flex;
    justify-content: end;
    flex-direction: column;
    align-items: end;
    gap: 15px;
}
</style>
