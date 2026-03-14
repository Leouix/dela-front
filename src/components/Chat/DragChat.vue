<script setup>
import VueDraggableResizable from 'vue-draggable-resizable';
import {ref, watch, nextTick, onMounted, computed} from 'vue';
import {useChatStore} from "@/stores/chatStore.js";
import ChatList from "@/components/Chat/ChatList.vue";
import ChatSingle from "@/components/Chat/ChatSingle.vue";
import {useWindowSize} from "@/stores/windowSize.js";
import EmptyChatListItem from "@/components/Chat/EmptyChatListItem.vue";
import DialogSingle from "@/components/Chat/DialogSingle.vue";

const chatStore = useChatStore();

const toTopMessages = ref(false);

const messagesScrollRef = ref(null);
const componentKey = ref(0);

const draggableRef = ref(null);

function toggleChat() {
    chatStore.isOpen = !chatStore.isOpen;
}

const messageInput = ref(null);

watch(() => chatStore.isOpen, (val) => {
    if (val) {
        nextTick(() => {
            messageInput.value?.focus()
            if (toTopMessages.value === true) {
                const el = messagesScrollRef.value
                if (el) {
                    el.scrollTop = el.scrollHeight
                }
                toTopMessages.value = false;
            }
        })

        chatStore.showNoteNewMessage = false;

    } else {
        chatStore.toAutoReturn()
    }

    chatStore.isOpen = val;
    localStorage.setItem('isOpen', val ? 'true' : 'false');

})

function closeCloud() {
    chatStore.showNoteNewMessage = false;
    chatStore.openChat(chatStore.getChat(chatStore.cloudChatId))
    chatStore.isOpen = true;
}

const chatW = ref(500)
const chatH = ref(500)
const chatX = ref(null)
const chatY = ref(null)

const { width, height } = useWindowSize();

if (width.value < 769) {
    chatW.value = width.value;
}

chatStore.hasUnreadMessage = computed(() => chatStore.hasChatUnread())

onMounted(() => {
    const savedW = localStorage.getItem('chatW')
    if (savedW && parseInt(savedW) >=0) chatW.value = parseInt(savedW);

    const savedH = localStorage.getItem('chatH')
    if (savedH && parseInt(savedH) >=0) chatH.value = parseInt(savedH);

    const savedX = localStorage.getItem('chatX')
    if (savedX) chatX.value = parseInt(savedX);

    const savedY = localStorage.getItem('chatY')
    if (savedY) chatY.value = parseInt(savedY);

    const isOpenLocal = localStorage.getItem('isOpen')
    chatStore.isOpen = isOpenLocal === 'true';

    const selectedJobApplicationChatId = localStorage.getItem('selectedJA');
    chatStore.setSelectedJobApplication(selectedJobApplicationChatId ? selectedJobApplicationChatId : null)
})

function onResizing(x, y, width, height) {
    setLocalStorage(x, y, width, height)
}

function onDragging(x, y) {
    setLocalStorage(x, y)
}

function setLocalStorage(x, y, width=null, height=null) {
    if (width) localStorage.setItem('chatW', width)
    if (height) localStorage.setItem('chatH', height)
    localStorage.setItem('chatX', x)
    localStorage.setItem('chatY', y)
    draggableRef.value = true;
}

function resetPosition() {
    chatW.value = 500;
    chatX.value = 0;
    if (width.value < 769) {
        chatW.value = width.value;
        chatX.value = 142;
    }
    chatH.value = 500;
    chatY.value = 0;
    localStorage.removeItem('chatW');
    localStorage.removeItem('chatH');
    localStorage.removeItem('chatX');
    localStorage.removeItem('chatY');
    componentKey.value++;
}

const selectedJobApplication = computed(()=> chatStore.selectedJobApplication)

watch(() => chatStore.selectedJobApplication, val => {
    if (val !== undefined) {
        localStorage.setItem('selectedJA', val?.chat_id)
    } else {
        localStorage.setItem('selectedJA', null)
    }
})

</script>

<template>
    <div>
        <div v-show="chatStore.isOpen" class="wrap-draggable">

            <vue-draggable-resizable
                :key="componentKey"
                v-show="chatStore.isOpen"
                :w="chatW"
                :h="chatH"
                :x="chatX"
                :y="chatY"
                :parent="false"
                id="chat-ai"
                :drag-handle="'.draggable-handle'"
                @resizing="onResizing"
                @dragging="onDragging"
            >
                <div class="chat-ai" >

                    <div class="chat-ai-header header-opened draggable-handle">

                        <div class="header-left" @click="toggleChat">

                            <img
                                :class="['header-arrow', chatStore.isOpen ? 'header-arrow-opened' : 'header-arrow-closed']"
                                src="/images/icons/arrow1-1.svg"
                                alt="reset form size"
                            >

                        </div>

                        <div class="header-right">
                            <div :class="['bell-icon', chatStore.hasUnreadMessage ? 'has-items' : '']"></div>

                            <div class="header-icons chat-logos">
                                <img :src="`/storage/images/ai_animate.gif`" alt="chat-icon"/>
                            </div>

                        </div>
                    </div>

                    <div v-show="chatStore.isOpen" :class="['chat-ai-body', { 'chat-ai-body-open': chatStore.isOpen }]">

                        <empty-chat-list-item v-if="(chatStore?.chats?.length ?? 0) < 1 && (chatStore?.dialogs?.length ?? 0) < 1" />

                        <chat-list v-else-if="selectedJobApplication === null" :isOpen="chatStore.isOpen" />

                        <dialog-single
                            v-else-if="selectedJobApplication?.type === 'dialog'"
                            :selectedJobApplication="selectedJobApplication"
                        />

                        <chat-single
                            v-else
                            :selectedJobApplication="selectedJobApplication"
                        />

                    </div>
                </div>

            </vue-draggable-resizable>

        </div>

        <!-- Закрытый чат -->
        <div v-show="!chatStore.isOpen" id="chat-ai-closed">

            <Transition name="fade">
                <div id="chat-cloud-message" v-show="chatStore.showNoteNewMessage" @click="closeCloud" :style="{ opacity: chatStore.opacity }">
                    {{ chatStore.noteNewMessageContent.slice(0, 37) }}<span v-if="chatStore.noteNewMessageContent.length > 37">...</span>
                </div>
            </Transition>

            <div class="chat-ai" >
                <div @click="toggleChat" class="chat-ai-header header-closed">
                    <img
                        :class="['header-arrow', chatStore.isOpen ? 'header-arrow-opened' : 'header-arrow-closed']"
                        src="/images/icons/arrow1-1.svg"
                        alt="reset form size"
                    >

                    <div class="header-right">
                        <div :class="['bell-icon', chatStore.hasUnreadMessage ? 'has-items' : '']"></div>

                        <div class="header-icons chat-logos">
                            <img :src="`/storage/images/ai_animate.gif`" alt="chat-icon"/>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <img class="arrow2" src="/images/icons/arrow2-1.svg" @click="resetPosition" alt="reset form size">
    </div>
</template>


<style>
@import "vue-draggable-resizable/style.css";

.wrap-draggable {
    position: absolute;
    width: 500px;
    height: 500px;
    right: 0;
    bottom: 0;
}

.wrap-draggable input {
    flex: 1;
    padding: 8px;
}

.wrap-draggable button {
    padding: 8px 12px;
}

.vdr .handle-tl {
    width: 19px !important;
    height: 19px !important;
    background: transparent;
    border: none !important;
    border-top: 1px double #000 !important;
    border-left: 1px double #000 !important;
    top: -5px;
    left: -5px;
}
.vdr .handle-tm {
    width: 19px !important;
    height: 5px !important;
    background: transparent;
    border: none !important;
    border-bottom: 1px double #000 !important;
}
.vdr .handle-tr {
    width: 19px !important;
    height: 19px !important;
    background: transparent;
    border: none !important;
    border-top: 1px double #000 !important;
    border-right: 1px double #000 !important;
    top: -5px;
    right: -5px;
}
.vdr .handle-ml {
    width: 5px !important;
    height: 19px !important;
    background: transparent;
    border: none;
    border-right: 1px double #000 !important;
}
.vdr .handle-mr {
    width: 5px !important;
    height: 19px !important;
    background: transparent;
    border: none;
    border-right: 1px double #000 !important;
    right: -5px;
}
.vdr .handle-bl {
    width: 19px !important;
    height: 19px !important;
    background: transparent;
    border: none !important;
    border-bottom: 1px double #000 !important;
    border-left: 1px double #000 !important;
    bottom: -5px;
    left: -5px;
}
.vdr .handle-bm {
    width: 19px !important;
    height: 5px !important;
    background: transparent;
    border: none !important;
    border-bottom: 1px double #000 !important;
    bottom: -5px;
}
.vdr .handle-br {
    width: 19px !important;
    height: 19px !important;
    background: transparent;
    border: none !important;
    border-bottom: 1px double #000 !important;
    border-right: 1px double #000 !important;
    bottom: -5px;
    right: -5px;
}

</style>
