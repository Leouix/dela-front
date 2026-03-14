import {defineStore} from 'pinia'

class ChatMessage {

    chatId;
    message;
    textMessage;

    constructor(eventObject) {

        if (eventObject?.chatMessage?.chat?.chat_id) {
            this.chatId = eventObject.chatMessage.chat.chat_id;
        } else if (eventObject?.message?.dialog_id) {
            this.chatId = eventObject?.message?.dialog_id
        }

        if (eventObject?.chatMessage) {
            this.message = eventObject.chatMessage;
        } else if (eventObject?.message) {
            this.message = eventObject?.message
        }

        if (eventObject?.chatMessage?.message) {
            this.textMessage = eventObject.chatMessage.message;
        } else if (eventObject?.message?.text) {
            this.textMessage = eventObject?.message?.text
        }
    }
}
export const useChatStore = defineStore('chatStore', {
    state: () => ({
        messages: [], // { message: string, created_at: DateTime, chat_id: string, user_id: user_id }
        hasUnreadMessageChats: [], // chat ids
        noteNewMessageContent: '',
        selectedJobApplication: null,
        chats: null,
        dialogs: null,
        userRole: null,
        showNoteNewMessage: false,
        isOpen: false,
        opacity: '1',
        cloudChatId: null,
        is_dialog: false,
        chatId: null,
    }),
    actions: {
        addMessage(message, chat_id) {
            this.messages.push({
                message: message,
                chat_id: chat_id,
                created_at: this.formatMessageDate(Date.now()),
                class: 'msg-my',
            });
        },
        addMessageDialog(text, chat_id) {
            this.messages.push({
                text: text,
                chat_id: chat_id,
                created_at: this.formatMessageDate(Date.now()),
                class: 'msg-my',
            });
        },
        formatMessageDate(dateString) {
            const date = new Date(dateString)
            const formatter = new Intl.DateTimeFormat('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            })
            return formatter?.format(date)
        },
        openChat(chat) {
            if (chat?.type === 'dialog') {
                this.openDialog(chat)
                return;
            }

            this.isOpen = true;
            this.selectedJobApplication = chat;
            this.markRead(chat.chat_id)
        },
        openDialog(dialog) {
            this.isOpen = true;

            this.is_dialog = true;
            const dialogId = dialog.chat_id
            this.selectedJobApplication = dialog;
            this.markRead(dialogId)
        },
        async getChatMessages(chatId) {
            if (this.is_dialog) {
                this.getMessages(chatId)
                return;
            }

            this.messages = [];
            this.markRead(chatId)
            this.sendLastActivity(chatId)
            await axios.post('/api/get-chat-messages/' + chatId)
                .then(response => {
                    if (response.data) {
                        this.messages = response.data;
                    }
                })
        },
        async getMessages(chatId) {
            await axios.post('/api/get-messages/' + chatId)
                .then(response => {
                    if (response.data) {
                        this.messages = response.data.data;
                    }
                })
        },
        markUnread(chat_id) {

            if (this.selectedJobApplication?.chat_id === chat_id) {
                return;
            }
            if (this.chats.length > 0) {
                const chat =  this.chats.find(chat => chat.chat_id === chat_id);
                if (chat) {
                    chat.has_unread_messages_user2 = true;
                    chat.has_unread_messages_user1 = true;
                    console.log(chat)
                    // this.saveUnreadChat(chat.chat_id)
                }
            }

            if (this.dialogs.length > 0) {
                const dialog = this.dialogs.find(chat => chat.chat_id === chat_id);

                if (dialog) {
                    dialog.has_unread_messages_user2 = true;
                    dialog.has_unread_messages_user1 = true;
                    console.log(dialog)
                  //   this.saveUnreadDialog(dialog.chat_id)
                }

            }
        },
        markRead(chat_id) {

            const chat = this.chats.find(chat => chat.chat_id === chat_id);
            if (chat) {
                chat.has_unread_messages_user2 = false;
                chat.has_unread_messages_user1 = false;
                this.saveReadChat(chat.chat_id)
            }

            const dialog = this.dialogs.find(chat => chat.chat_id === chat_id);
            if (dialog) {
                dialog.has_unread_messages_user2 = false;
                dialog.has_unread_messages_user1 = false;
                this.saveReadDialog(dialog.chat_id)
            }
        },
        saveReadDialog(chat_id) {
            axios.post('/api/dialog-read/' + chat_id, {
                chat_id
            }).then(r => {

            })
        },
        saveUnreadDialog(chat_id) {
            axios.post('/api/dialog-unread/' + chat_id, {
                chat_id
            }).then(r => {

            })
        },
        saveReadChat(chat_id) {
            axios.post('/api/chat-read/' + chat_id, {
                chat_id
            }).then(r => {

            })
        },
        saveUnreadChat(chat_id) {
            axios.post('/api/chat-unread/' + chat_id, {
                chat_id
            }).then(r => {

            })
        },
        hasChatUnread() {
            const has_unread_messages = (chat) => {
                return this.userRole === 'candidate'
                    ? chat.has_unread_messages_user2
                    : chat.has_unread_messages_user1;
            }
            return this.chats?.some(chat => has_unread_messages(chat) === true)
                || this.dialogs?.some(chat => has_unread_messages(chat) === true);
        },
        toReturn(chat_id) {
            this.messages = [];

            this.markRead(chat_id)
            this.sendLastActivity(this.selectedJobApplication?.chat_id)

            this.selectedJobApplication = null;
        },
        toAutoReturn() {
            // срабатывает когда закрывается чат isOpen=true
            if (!this.selectedJobApplication?.chat_id) {
                return;
            }

            this.markRead(this.selectedJobApplication.chat_id)
            this.messages = [];
            this.sendLastActivity(this.selectedJobApplication?.chat_id)

            this.selectedJobApplication = null;
        },
        sendLastActivity(chat_id) {
            axios.post('/api/chat-last-activity', {
                chat_id: chat_id,
                is_dialog: this.is_dialog
            }).then(r => {})
        },
        setChats(chats) {
            this.chats = (chats.chats ?? []).map(chat => this.chatItemDTO(chat));
            this.dialogs = (chats.dialogs ?? []).map(chat => this.chatDialogDTO(chat));
        },
        chatItemDTO(item) {

            const itemDto = {
                chat_id: item.chat_id,
                label: null,
                item_url: null,
                item_title: null,
                item_company: null,
                user_candidate: null,
                has_unread_messages_user2: item.has_unread_messages_user2,
                has_unread_messages_user1: item.has_unread_messages_user1,
                company_image_url: null,
                chat_is_blocked: item.is_blocked,
                companion_name: item.companionName,
                companion_url: item.companionUrl,
                last_activity_candidate: item.last_activity_candidate,
                last_activity_company: item.last_activity_company,
            };

            if (item?.chatable_type === "App\\Models\\JobApplication") {
                itemDto.label = 'Вакансия';
                itemDto.type = 'job';
                itemDto.item_url = '/overview/vacancy/' + item.chatable.post_item.slug;
                itemDto.item_title = item.chatable.post_item.title;
                itemDto.item_company = item.chatable.post_item.author.user_company.title;
                itemDto.user_candidate = item.chatable.user_candidate.name ?? item.chatable.user_candidate.user.email;
                itemDto.company_image_url = item.chatable.post_item?.author?.user_company?.image?.url;
            } else if (item?.chatable_type === "App\\Models\\TaskApplication") {
                itemDto.label = 'Задача';
                itemDto.type = 'task';
                itemDto.item_url = item.chatable.task_order?.slug ? '/task-order/' + item.chatable.task_order?.slug : '/overview/task/' + item.chatable.task.slug;
                itemDto.item_title = item.chatable.task.title;
                itemDto.item_company = item.chatable.task.author.user_company.title;
                itemDto.user_candidate = item.chatable.user_candidate.name ?? item.chatable.user_candidate.user.email;
                itemDto.company_image_url = item.chatable.task?.author?.user_company?.image?.url;
            }

            return itemDto;
        },
        chatDialogDTO(item) {
            return {
                chat_id: item.id,
                label: '',
                item_url: null,
                item_title: item.item_title,
                item_company: item.item_company,
                user_candidate: null,
                has_unread_messages_user2: item.has_unread_messages_user2,
                has_unread_messages_user1: item.has_unread_messages_user1,
                company_image_url: null,
                chat_is_blocked: item.is_blocked,
                companion_name: item.companionName,
                companion_url: item.companionUrl,
                type: 'dialog',
                last_activity_candidate: item.last_activity_candidate,
                last_activity_company: item.last_activity_company,
            };
        },
        connectToChat(chatId) {

            if (!chatId) return;

            const channel = window.Echo.private(`chat.${chatId}`);

            channel.listen('.SendMessage', (e) => {

                const {chatId,
                    message,
                    textMessage} = new ChatMessage(e);

                this.handleChatIncoming(chatId, message, textMessage);
            });
        },
        connectToDialog(chatId) {
            if (!chatId) return;

            const channel = window.Echo.private(`chat.${chatId}`);

            channel.listen('.SendMessageDialog', (e) => {

                const {chatId,
                    message,
                    textMessage} = new ChatMessage(e);

                this.handleChatIncoming(chatId, message, textMessage);

            });
        },
        handleChatIncoming(chatId, message, textMessage) {
            this.messages.push(message);
            this.markUnread(chatId);

            if (!this.isOpen) {
                this.cloudChatId = chatId
                this.noteNewMessageContent = textMessage;
                this.showNoteNewMessage = true;
            }

            setTimeout(() => {
                this.opacity = '0.7'
            }, 5000); // добавить прозрачность в уведомление о новом сообщении cloud

            setTimeout(() => {
                this.showNoteNewMessage = false;
                if (this.isOpen === false) {
                    this.hasUnreadMessageChats.push(chatId)
                }
            }, 15000); // сколько висит уведомление о новом сообщении cloud

            setTimeout(() => {
                this.opacity = '1'
                this.noteNewMessageContent = '';
            }, 16300); // вернуть НЕпрозрачность и очистить поле
        },
        chatsConnect(user) {

            if (user?.id) {
                this.chats?.forEach(chat => {
                    this.connectToChat(chat.chat_id);
                });

                this.dialogs?.forEach(chat => {
                    this.connectToDialog(chat.chat_id);
                });

                const channelNewChat = window.Echo.private(`chat.new.${user.id}`);

                channelNewChat.listen('.CreateChat', (e) => {

                    this.chats.push(this.chatItemDTO(e.chat));

                    this.connectToChat(e.chat.chat_id);
                })
            }
        },
        setSelectedJobApplication(chatId) {
            if (this.chats === null || this.chats === undefined) {
                return;
            }
            const selectedJobApplication = this.chats.find(chat => chat.chat_id === chatId)
            if (selectedJobApplication) {
                this.selectedJobApplication = selectedJobApplication;
            }

        },
        setTaskOrderToChatItem(chatId, taskOrder) {
            this.chats.forEach((chat) => {
                if (chat.chat_id === chatId) {
                    chat.item_url = `/task-order/`+taskOrder.slug
                }
            })
        },
        getChat(chatId) {
            const chat = this.chats.find(chat => chat.chat_id === chatId);
            if (chat) {
                return chat;
            }

            const dialog = this.dialogs.find(chat => chat.chat_id === chatId);
            if (dialog) {
                return dialog;
            }

            return null;
        },
        linkify(text) {
            if (!text) return '';
            const escaped = text
                ?.replace(/&/g, "&amp;")
                ?.replace(/</g, "&lt;")
                ?.replace(/>/g, "&gt;");

            const URL_REGEX =
                /\b(?:https?:\/\/[^\s]+|(?:[a-z0-9-]+\.)+[a-z]{2,})(?!@)/gi;

            return escaped.replace(URL_REGEX, (url) => {
                // убираем символы .,;!?)@* ТОЛЬКО с конца
                const cleanUrl = url.replace(/[.,;!?)@*]+$/, '');
                const tail = url.slice(cleanUrl.length);

                // если схемы нет — добавляем https://
                const href = cleanUrl.startsWith('http')
                    ? cleanUrl
                    : `https://${cleanUrl}`;

                return `<a href="${href}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>${tail}`;
            });
        },
    }
})
