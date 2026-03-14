<script setup>
import {useCandidateStore} from "@/stores/candidate.js";
import {useChatStore} from "@/stores/chatStore.js";

const props = defineProps({
    jobApplication: Object | null,
});

const store = useCandidateStore();
const chatStore = useChatStore();

store.candidate = props.jobApplication.user_candidate

store.notes = props.notes

store.candidate.form_job = props.jobApplication.user_candidate.form_job ?? '';
store.candidate.gender = props.jobApplication.user_candidate.gender ?? '';

function avatarUrl() {
    return props.jobApplication.user_candidate?.avatar?.url ? props.jobApplication.user_candidate?.avatar?.url : '/images/default-ava-5.png'
}

const openChat = () => {
    chatStore.isOpen = true;
    chatStore.openChat(chatStore.chatItemDTO(props.jobApplication.chat))
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

                <a :href="`/my/company/overview/candidate/${props.jobApplication.user_candidate.id}`"> {{ props.jobApplication.user_candidate.name }}</a>

            </div>

            <div class="open-chat" @click="openChat">Чат</div>
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
        }
    }
}

</style>
