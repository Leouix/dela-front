import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

export const useEditTaskStore = defineStore('editTaskStore', {
    state: () => {
        return {
            task: {
                documents: []
            },
            addedDocuments: [],
            deletedDocumentIds: [],
            emailSuggestions: null,
        }
    },
    actions: {
        edit(e, emailsData) {

            this.hideError();

            const formData = new FormData(e.target);
            formData.append('is_personal', this.task.is_personal ? "1" : "0");

            if (emailsData.emailsArrayRef.value && emailsData.emailsArrayRef.value.length > 0) {
                emailsData.emailsArrayRef.value.forEach((email) => {
                    formData.append('personal_members[]', email);
                });
            }

            if (emailsData.text.value?.length > 0) {
                formData.append('text', emailsData.text.value);
            }

            if (this.deletedDocumentIds.length > 0 && this.task.has_task_applications !== true) {
                this.deletedDocumentIds.forEach((documentId) => {
                    formData.append('deleteDocuments[]', documentId);
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

            axios.post('/api/my/company/edit-task', formData)
                .then((response) => {
                    if (response.status === 200) {
                      // window.location.href = `/my/company/my-tasks`;
                        this.noticeSuccess();
                    }
                })
                .catch((error) => {
                    console.log(error)
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
        deleteDocument(file) {
            this.task.documents = this.task.documents.filter(
                (document) => document.name !== file.name
            );
            this.deletedDocumentIds.push(file.id);
        },
        deleteAddedDocument(file) {
            this.addedDocuments = this.addedDocuments.filter(
                (document) => document.name !== file.name
            );
        },
        noticeSuccess() {
            const noticeStore = useNoticeSuccessStore()
            noticeStore.run()
        },
        noticeError(text) {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.run(text)
        },
        hideError() {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.hide()
        },
        duplicate() {
            if (!this.task?.id) {
                this.noticeError('Не удалось определить задачу');
                return;
            }

            axios.post(`/api/tasks/${this.task.id}/duplicate`)
                .then((response) => {
                    if (response.status === 201) {
                        this.noticeSuccess(response.data.message);

                        // если нужно — редирект на новую задачу
                     //   window.location.href = `/tasks/${response.data.task.slug}/edit`;
                    }
                })
                .catch((error) => {
                    console.error(error);

                    if (error?.response?.data?.message) {
                        this.noticeError(error.response.data.message);
                    } else {
                        this.noticeError('Ошибка при дублировании задачи');
                    }
                });
        },
        getPersonalMembers() {
            axios.post('/api/my/company/get-personal-members')
                .then(response => {
                    if (response.status === 200) {
                        this.emailSuggestions = response.data
                    }
                })
        },
    },
    getters: {
        getCountDocuments: (state) => {
            return state.task.documents.length + state.addedDocuments.length;
        },
        tomorrow: (state) => {
            const now = new Date()
            now.setDate(now.getDate() + 1)

            const year = now.getFullYear()
            const month = String(now.getMonth() + 1).padStart(2, '0')
            const day = String(now.getDate()).padStart(2, '0')

            return `${year}-${month}-${day}` // YYYY-MM-DD
        }
    }
})
