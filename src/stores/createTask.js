import {defineStore} from "pinia";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

function formatDateLocal(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export const useCreateTaskStore = defineStore('createTaskStore', {
    state: () => {

        const tomorrowDate = new Date()
        tomorrowDate.setDate(tomorrowDate.getDate() + 1)

        return {
            task: {
                documents: [],
                title: null,
                text: '',
                cost: null,
                is_personal: false,
                status: 'draft',
                deadline: formatDateLocal(tomorrowDate),
                personalUsersEmail: '',
            },
            addedDocuments: [],
            deletedDocumentIds: [],
            emailSuggestions: null,
        }
    },
    actions: {
        create(emailsArrayRef) {

            this.hideError();

            const formData = new FormData();

            formData.append('title', this.task.title);
            formData.append('text', this.task.text);
            formData.append('cost', this.task.cost);
            formData.append('is_personal', this.task.is_personal ? "1" : "0");
            formData.append('post_status', this.task.status);
            formData.append('deadline', this.task.deadline);

            if (emailsArrayRef.value && emailsArrayRef.value.length > 0) {
                emailsArrayRef.value.forEach((email) => {
                    formData.append('personal_members[]', email);
                });
            }

            if (this.addedDocuments.length > 0) {
                this.addedDocuments.forEach((document) => {
                    formData.append('addDocuments[]', document);
                });
            }

            if (this.getCountDocuments > 10) {
                this.noticeError("Превышено максимально количество документов: 10")
                return;
            }

            if (formData.entries().next().done) {
                return;
            }

            axios.post('/api/my/company/new-task', formData)
                .then((response) => {
                    if (response.status === 201) {
                      window.location.href = `/my/company/my-tasks`;
                    }
                })
                .catch((error) => {
                    if (error?.response?.data?.message) {
                        this.noticeError(error?.response?.data?.message)
                    }
                });
        },
        addDocuments(e) {
            if (this.getCountDocuments >= 10) {
                this.noticeError("Превышено максимально количество документов: 10")
                return;
            }

            const ALLOWED_MIME_TYPES = [
                'image/jpeg',
                'image/png',
                'image/webp',

                'application/pdf',
                'text/plain',
                'text/xml',
                'application/xml',

                'application/zip',
                'application/x-zip-compressed',

                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ];

            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

            const files = e?.target?.files;
            if (!files || files.length === 0) return;

            Array.from(files).forEach((file) => {

                if (this.getCountDocuments >= 10) {
                    this.noticeError("Превышено максимально количество документов: 10")
                    return;
                }

                // проверка типа
                if (!ALLOWED_MIME_TYPES.includes(file.type)) {
                    this.noticeError(
                        `Файл "${file.name}" не поддерживается.
Допустимые форматы: изображения, pdf, txt, xml, zip, doc, docx, xls, xlsx`
                    );
                    return;
                }

                // проверка размера
                if (file.size > MAX_FILE_SIZE) {
                    this.noticeError(
                        `Файл "${file.name}" превышает 10 MB`
                    );
                    return;
                }

                this.addedDocuments.push(file);
            });
        },
        deleteAddedDocument(file) {
            this.addedDocuments = this.addedDocuments.filter(
                (document) => document.name !== file.name
            );
        },
        setDocuments(e) {
            const files = e?.target?.files;
            if (!files || files.length === 0) return;
            Array.from(files).forEach((file) => {
                this.task.documents.push(file);
            });
        },
        noticeError(text) {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.run(text)
        },
        hideError() {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.hide()
        },
        getPersonalMembers() {
            axios.post('/api/my/company/get-personal-members')
                .then(response => {
                    if (response.status === 200) {
                        this.emailSuggestions = response.data
                    }
                })
        }
    },
    getters: {
        getAvatarUrl: (state) => {
            return state?.task?.avatar?.url ? state?.task?.avatar?.url : '/images/default-ava-5.png'
        },
        tomorrow: (state) => {
            const now = new Date()
            now.setDate(now.getDate() + 1)

            const year = now.getFullYear()
            const month = String(now.getMonth() + 1).padStart(2, '0')
            const day = String(now.getDate()).padStart(2, '0')

            return `${year}-${month}-${day}` // YYYY-MM-DD
        },
        formattedDeadline: (state) => {
            if (!state.task.deadline) return ''
            const date = new Date(state.task.deadline)
            return date.toLocaleDateString('ru-RU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        },
        getCountDocuments: (state) => {
            return state.task.documents.length + state.addedDocuments.length;
        },
    }
})
