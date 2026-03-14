<script setup>
import {useChatStore} from "@/stores/chatStore.js";
import {computed, ref} from "vue";
import ChatAvatar from "@/components/Chat/ChatAvatar.vue";
import {usePage} from "@inertiajs/vue3";

const store = useChatStore();

const page = usePage();
const userRole = page.props.auth?.user?.mode;

store.userRole = userRole;

const props = defineProps({
    isOpen: Boolean
})

const messagesScrollRef = ref(null)

const chatItems = computed(() => {
    return [
        ...store.chats,
        ...store.dialogs
    ]
        .filter(Boolean)
        .sort((a, b) => {
            const dateA = getLastActivityDate(a)
            const dateB = getLastActivityDate(b)
            // 🔥 новые чаты сверху
            return dateB - dateA
        })
})

function getLastActivityDate(chat) {

    const candidate = chat.last_activity_candidate
        ? new Date(chat.last_activity_candidate)
        : null

    const company = chat.last_activity_company
        ? new Date(chat.last_activity_company)
        : null

    // если обе есть — берём самую позднюю
    if (candidate && company) {
        return Math.max(candidate, company)
    }

    // если есть только одна
    return candidate || company || 0
}

</script>

<template>

    <ul class="chats" ref="messagesScrollRef">
        <li
            v-for="item in chatItems"
            :key="item.id"
            :class="['chat-item', item.chat_is_blocked ? 'chat-blocked' : '']"
            v-drag-click="() => item.item_company ? store.openChat(item) : null"
        >
            <ChatAvatar :item="item" :userRole="userRole"/>

            <div class="item-body">

                <div :class="['chat-item-label', item.type === 'job' ? 'chat-item-label-job' : 'chat-item-label-task']">
                    {{ item.label }}
                </div>

                <div class="chat-title" >
                    {{ item.item_title }} <br>

                    <a :href="item.companion_url" target="_blank" rel="noopener noreferrer">
                        <span>{{ item.companion_name }}</span>
                    </a>

                </div>

            </div>

        </li>
    </ul>

</template>

<style scoped>

.item-body {
    display: flex;
    flex-direction: column;

    .chat-item-label {
        font-size: 11px;
    }

    .chat-item-label-job {
        color: #fcf1b9;
    }

    .chat-item-label-task {
        color: #d2d2ff;
    }
}

</style>
