<script setup>
import {useChatStore} from "@/stores/chatStore.js";
import {nextTick, onMounted, ref, watch} from "vue";
import {useUtilsStore} from "@/stores/utils.js";

const props = defineProps({
    selectedJobApplication: Object|null,
});

const store = useChatStore();
const input = ref('')

async function toSendMessage(e) {
    if (props.selectedJobApplication.chat_is_blocked) {
        return;
    }

    if (input.value.trim()) {

        store.addMessageDialog(input.value, store.chatId)
        store.markUnread(store.chatId)

        const form = new FormData(e.target)
        await axios.post('/api/dialog/', form, {
            withCredentials: true
        })
    }

    input.value = ''
}

onMounted(() => {
    store.getMessages(props.selectedJobApplication.chat_id);
})

const messagesScrollRef = ref(null)

watch(
    () => store.messages.length,
    async () => {
        await nextTick()
        const el = messagesScrollRef.value
        if (el) {
            el.scrollTop = el.scrollHeight
        }
    }
)

const chatId = props.selectedJobApplication.chat_id;
store.chatId = chatId;

const utilStore = useUtilsStore();

</script>

<template>

    <div class="chat-single">

        <a
            :href="props.selectedJobApplication.item_url"
            target="_blank" rel="noopener noreferrer"
            class="post-link">{{utilStore.previewText(props.selectedJobApplication.item_title, 35)}}
        </a>

        <div @click="store.toReturn(props.selectedJobApplication.chat_id)" class="return-chats-icon"></div>

        <ul
            class="chat-messages"
            ref="messagesScrollRef"
        >
            <li
                :class="msg.class"
                v-for="(msg, idx) in store.messages" :key="idx"
            >
                <div class="chat-item">
                    <a :href="msg?.companionUrl" target="_blank" rel="noopener noreferrer">
                        <div
                            class="chat-item-name"
                            v-if="msg?.isCompanionsMessage">
                            {{msg?.companionName}}
                        </div>
                    </a>
                    <div class="chat-item-text"
                         v-html="store.linkify(msg?.text)"
                    ></div>
                    <div class="chat-item-date">{{ msg?.created_at }}</div>
                </div>

            </li>
        </ul>

        <form id="chat-ai-form"  @submit.prevent="toSendMessage">

            <div class="bottom-form-area">

                <textarea
                    :disabled="props.selectedJobApplication.chat_is_blocked"
                    :class="['form-message-input', props.selectedJobApplication.chat_is_blocked ? 'chat-blocked' : '']"
                    v-model="input"
                    name="message"
                    placeholder="Напишите сообщение..."
                    ref="messageInput"
                    rows="2"
                    style="resize: vertical"
                ></textarea>

                <input type="hidden" name="chatId" v-model="store.chatId">

                <div class="submit-wrapper">
                    <input
                        type="submit"
                        value=""
                        :disabled="props.selectedJobApplication.chat_is_blocked"
                        :class="[props.selectedJobApplication.chat_is_blocked ? 'chat-blocked' : '']"
                    >
                </div>

            </div>
        </form>
    </div>


</template>

<style scoped>
.chat-item-name {
    font-size: 12px;
}
</style>
