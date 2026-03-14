import {defineStore} from "pinia";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

export const useCreatePostItemStore = defineStore('createPostItemStore', {
    state: () => {
        return {
            postItem: {
                'avatar': {},
            },
        }
    },
    actions: {
        create(e) {

            const formData = new FormData(e.target);
            if (formData.entries().next().done) {
                return;
            }

            axios.post('/api/my/company/new-vacancy', formData, {
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then((response) => {
                    if (response.status === 201) {
                        const postItemId = response.data.data.id;
                        window.location.href = `/my/company/my-vacancies`;
                    }
                })
                .catch((error) => {
                    if (error?.response?.data?.message) {
                        this.noticeError(error?.response?.data?.message)
                    }
                });
        },
        createPartner(e) {

            const formData = new FormData(e.target);
            if (formData.entries().next().done) {
                return;
            }

            axios.post('/api/company/new-partner-vacancy', formData, {
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then((response) => {
                    if (response.status === 201) {
                        const postItemId = response.data.data.id;
                        window.location.href = `/my/company/my-vacancies`;
                    }
                })
                .catch((error) => {
                    if (error?.response?.data?.message) {
                        this.noticeError(error?.response?.data?.message)
                    }
                });
        },
        onchangeAvatar(e) {
            const file = e.target.files[0];
            let fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                this.setTempAvatar(fileReader.result)
            }
        },
        setTempAvatar(data) {
            if (!this.postItem?.avatar?.url) {
                this.postItem.avatar = {}
            }
            this.postItem.avatar.url = data
        },
        noticeError(text) {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.run(text)
        },
    },
    getters: {
        getAvatarUrl: (state) => {
            return state?.postItem?.avatar?.url ? state?.postItem?.avatar?.url : '/images/default-ava-5.png'
        },
    }
})
