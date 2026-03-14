<script setup>
import {useCandidateStore} from "@/stores/candidate.js";
import {useTaskOrderStore} from "@/stores/taskOrder.js";
import {useChatStore} from "@/stores/chatStore.js";
import {ref} from "vue";

const props = defineProps({
    taskApplication: Object | null,
});

const store = useCandidateStore();
const taskStore = useTaskOrderStore();
const chatStore = useChatStore();

store.candidate = props.taskApplication.userCandidate
store.notes = props.notes

// потому что store singleton
const hasTaskOrder = ref(props.taskApplication.has_task_order);

function avatarUrl() {
    return props.taskApplication.userCandidate?.avatar?.url
        ? props.taskApplication.userCandidate?.avatar?.url
        : '/images/default-ava-5.png'
}

const openChat = () => {
    chatStore.isOpen = true;
    chatStore.openChat(chatStore.chatItemDTO(props.taskApplication.chat))
}

function createTaskApplication() {
    hasTaskOrder.value = true;
    taskStore.create(props.taskApplication)
}

</script>

<template>
    <div class="draggable-item">
        <div class="item-content">
            <div class="user-info">
                <picture class="avatar">
                    <source v-bind:srcset="avatarUrl()" type="image/webp">
                    <source v-bind:srcset="avatarUrl()" type="image/jpeg">
                    <img id="candidate-avatar" class="avatar" v-bind:src="avatarUrl()" alt="candidate avatar">
                </picture>

                <a :href="`/my/company/overview/candidate/${props.taskApplication.userCandidate.slug}`"> {{ props.taskApplication.userCandidate.name }}</a>

            </div>

            <div class="open-chat" @click="openChat">Чат</div>
        </div>

        <div class="block-buttons">
            <button :class="['accept-button', hasTaskOrder ? 'applied' : '']" @click="createTaskApplication">Отправить в работу</button>
        </div>

    </div>
</template>

<style scoped>

.avatar {
    width: 50px;
    border-radius: 4px;
}
.draggable-item {
    padding: 10px;
    background: #616f8c;
    cursor: move;
    width: 100%;
    box-sizing: border-box;
    color: #ffffff;
    border-radius: 7px;

    @media screen and (min-width: 680px) {
        width: 48%;
    }

    .item-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .user-info {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .open-chat {
            margin: 15px;
            cursor: pointer;
        }
    }

    .block-buttons {

        display: flex;

        button {
            min-width: 250px;
            height: 35px;
        }
        .cancel-button {
            background: #9b9b9b;
            margin: 5px 5px 5px 0;
        }

        .accept-button {
            background: #22b525;
            margin: 5px;

            &.applied {
                background: #cccccc;
            }
        }
    }
}

</style>
