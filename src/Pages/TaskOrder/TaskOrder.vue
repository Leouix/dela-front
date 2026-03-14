<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {ref} from "vue";
import {useTaskOrderStore} from "@/stores/taskOrder.js";
import RichEditor from "@/components/RichEditor.vue";
import {useChatStore} from "@/stores/chatStore.js";
import {Head, usePage} from "@inertiajs/vue3";

const props = defineProps({
    taskOrder: Object,
    orderStatusActionTypes: Object,
    deadlineStatistics: Object,
});

const store = useTaskOrderStore();

const page = usePage();

function getChatApplication() {
    return page.props.chats.find((chat) => chat.chat_id === props.taskOrder?.data?.item.taskApplication.chat.chat_id)
}

const userRole = page.props.auth.user?.mode;

store.item = props.taskOrder?.data?.item ?? {};

store.item.deadline =  props.taskOrder?.data?.item?.deadline ?? props.taskOrder?.data?.item.taskApplication.task.deadline;
store.orderStatusActionTypes = props.taskOrder.data.orderStatusActionTypes
store.deadlineStatistics = props.taskOrder.data.deadlineStatistics;

const item = store.item;

const newDateDeadline = ref(' __.__.__ ');
const daysToAdd = ref(0);
const formattedOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
const notes = ref(store.item.notes ?? '');

const chatStore = useChatStore();

function calculateDeadline(e) {

    const days = Number(e.target.value);
    daysToAdd.value = days;

    if (!item.deadline) return;

    // 🧩 Разбираем строку "2025-10-30 20:16:18" в дату
    const stringDateOnly = item.deadline.split(' ')[0];
    const [year, month, day] = stringDateOnly.split('-').map(Number);
    const baseDate = new Date(year, month - 1, day); // month - 1, потому что месяцы в JS начинаются с 0

    if (isNaN(baseDate)) {
        console.error('Некорректная дата:', item.deadline);
        return;
    }

    // ➕ Прибавляем дни
    baseDate.setDate(baseDate.getDate() + days);

    // 🗓 Форматируем в читаемый вид
    newDateDeadline.value = baseDate.toLocaleDateString('ru-RU', formattedOptions);
}

const deadlineFormatted = (stringDate) => {
    const stringDateOnly = stringDate.split(' ')[0];
    const [year, month, day] = stringDateOnly.split('-').map(Number);
    const baseDate = new Date(year, month - 1, day); // month - 1, потому что месяцы в JS начинаются с 0
    return baseDate.toLocaleDateString('ru-RU', formattedOptions);
}

const onSubmit = async (e) => {
    await store.setDeadline(e)
    e.target.reset();
    newDateDeadline.value = ' __.__.__ ';
}

const openChat = () => {
    chatStore.isOpen = true;
    chatStore.openChat(chatStore.chatItemDTO(getChatApplication()))
}
</script>

<template>

    <Head title="Выполнение задачи" />

    <AppLayout>
        <div>

            <a :href="`/overview/task/`+item.taskApplication.task.slug" target="_blank" rel="noopener noreferrer" class="title-link"><h1>{{ item.taskApplication.task.title }}</h1></a>

            <p>Мастер по задаче:
               <span class="p-value link-span"> <a :href="`/overview/specialist/`+ item.taskApplication.userCandidate.slug" target="_blank" rel="noopener noreferrer">{{ item.taskApplication.userCandidate.name}}</a></span>
            </p>

            <p>Стоимость задачи: <span class="p-value">{{ item.taskApplication.task.cost}} USDT</span></p>

            <p>Deadline: <span class="p-value">{{ deadlineFormatted(store.item.deadline)}}</span> </p>

            <div class="deadline-area">
                <form v-if="userRole === 'company'" @submit.prevent="onSubmit" class="add-days-form">
                    <div class="form-row">
                        <p>Увеличить срок по задаче на
                            <input
                                type="number"
                                name="days"
                                min="0"
                                @input="calculateDeadline"
                                :disabled="store.getIsItemClosed"
                            >
                            дней</p>
                    </div>
                    <div class="form-row">
                        <p class="new-date-deadline">{{ newDateDeadline }}</p>
                        <input type="submit" value="Сохранить" :disabled="store.getIsItemClosed">
                    </div>
                </form>


                <div class="deadlines-history">
                    <h3>История дедлайнов:</h3>
                    <div class="deadline-item" v-for="deadlineStatistic in store.deadlineStatistics">
                        {{ deadlineStatistic?.created_at }}: {{ deadlineFormatted(deadlineStatistic?.date)}}
                    </div>
                </div>
            </div>

            <div class="status-area">
                <h3 class="mt-3">Текущий статус задачи:</h3>
                <div class="task-order-status">{{item.orderStatusType.label}}</div>
            </div>

            <div class="status-actions">
                <h4>Действия:</h4>

                <div :class="['action-buttons', store.loading ? 'loading' : '']">
                    <button v-for="orderStatusActionType in store.orderStatusActionTypes"
                            :key="orderStatusActionType.name"
                            :value="orderStatusActionType.name"
                            :class="['action-button', orderStatusActionType.class]"
                            :disabled="orderStatusActionType.is_disabled"
                            @click="store.changeStatusSubmit(orderStatusActionType.name)"
                    >
                        {{ orderStatusActionType.label }}
                    </button>
                </div>

            </div>

            <div  v-if="userRole === 'company'" class="personal-notes">
                <h4 style="margin-bottom:0">Персональные заметки</h4>
                <p class="task-order-notes">видны только вам</p>

                <form @submit.prevent="store.saveNotes">
                    <input
                        type="hidden"
                        name="notes"
                        v-model="notes"
                    >
                    <input type="hidden" name="task_order_id" :value="item.id">

                    <RichEditor v-model="notes" />

                    <input type="submit" value="Сохранить">
                </form>
            </div>


            <div class="chat-link-gonna" @click="openChat">-> Перейти к чату</div>
        </div>
    </AppLayout>
</template>

<style scoped>
.btn {
    padding: 8px 16px;
    border-radius: 6px;
    background-color: #007bff;
    color: white;
}


.p-value {
    color: #8AE3E8;
    &.link-span {
        text-decoration: underline;
    }
}

.deadline-area {

    display: flex;
    flex-direction: column-reverse;

    @media screen and (min-width: 920px) {
        flex-direction: row;
    }


    form.add-days-form {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 100%;
        border-radius: 4px;
        box-sizing: border-box;
        justify-content: center;
        margin: 10px 0;

        background: #4b4b4b;
        border: 1px solid #9a9a9a;
        padding: 15px;
        gap: 20px;

        @media screen and (min-width: 920px) {
            margin: 10px 5px;
            padding: 10px;
        }

        @media screen and (min-width: 530px) {
            max-width: 510px;
        }

        .form-row {
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: space-around;

            p {
                margin-bottom: 0;
                margin-top: 0;
                padding: 0;

                @media screen and (min-width: 400px) {
                    min-width: 200px;
                }
            }
        }

        input[type="number"] {
            border-radius: 4px;
            width: 75px;
            border: none;
            padding: 5px 8px;
            margin: 0 5px;
            background-color: #ffffffcf;
            font-size: 16px;
        }

        input[type="submit"] {
            border: 1px solid #8AE3E8;
            border-radius: 4px;
            color: #8AE3E8;
            background: #ffffff17;
            margin: 0;

            &:disabled {
                cursor: default;
            }
        }
    }

    .deadlines-history {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        border-radius: 4px;
        padding: 15px;
        background: #4b4b4b;
        border: 1px solid #9a9a9a;


        @media screen and (min-width: 530px) {
            max-width: 510px;
            margin: 10px;
        }

        h3 {
            margin-top: 0;
            margin-bottom: 10px;
        }

        .deadline-item {
            font-size: 16px;
        }
    }
}

.status-actions {
    display: flex;
    flex-direction: column;
    max-width: 100%;

    @media screen and (min-width: 450px) {
        max-width: 250px;
    }

    .action-buttons {


        .action-button {
            border: 1px solid #516df0;
            color: #7c93fc;
            background: transparent;
            margin: 10px 0;
            width: 100%;

            &.status-action-schedule {
                background-color: #4754ff0f;
                border: 1px solid #9ba6f1;
                color: #9ba6f1;
            }

            &.status-action-cancel {

                background-color: #ff47470f;
                border: 1px solid #932e2e;
                color: #ab4e4e;
            }

            &.status-action-complete {
                border: 1px solid #37b235;
                color: #37b235;
                background: #d9d9d91c;
            }

            &.disabled {
                border: 1px solid grey;
                color: gray;
                cursor: default;
                opacity: 0.3;
            }
        }

        &.loading {
            background: url("/images/icons/spinner.gif");
            background-repeat: no-repeat;
            background-size: 35px 35px;
            background-color: #ffffff14;
            background-position-x: 50%;
            background-position-y: 50%;
            pointer-events: none;

            .action-button {
                border: 1px solid grey;
                color: gray;
                cursor: default;
            }

        }
    }
}

.title-link {
    text-decoration: underline;
    display: inline-block;
}


.task-order-notes {
    font-size: 14px;
    margin: 0;

}

.status-area {

    h3 {
        margin-bottom: 10px;
    }
    .task-order-status {
        font-size: 16px;
        background: #0f5c0f;
        display: inline-block;
        padding: 3px 10px;
        border-radius: 4px;
    }
}

</style>
