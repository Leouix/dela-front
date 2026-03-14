import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

export const useEditPostItemStore = defineStore('editPostItemStore', {
    state: () => {
        return {
            postItem: {
                'avatar': {},
            },
        }
    },
    actions: {
        edit(e) {
            const form = e.target;
            const formData = new FormData(form);
            if (formData.entries().next().done) {
                return;
            }
            const data = new FormData(e.target)
            axios.post('/api/my/company/edit-vacancy/', data, {
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                     //  const postItemId = response.data.data.id;
                      window.location.href = `/my/company/my-vacancies`;
                    }
                })
                .catch((error) => {
                    if (error?.response?.data?.message) {
                        this.noticeError(error?.response?.data?.message)
                    }
                });
        },
        editPartner(e) {
            const form = e.target;
            const formData = new FormData(form);
            if (formData.entries().next().done) {
                return;
            }
            const data = new FormData(e.target)
            axios.post('/api/company/edit-partner-vacancy/', data, {
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        //  const postItemId = response.data.data.id;
                        window.location.href = `/my/company/my-vacancies`;
                    }
                })
                .catch((error) => {
                    if (error?.response?.data?.message) {
                        this.noticeError(error?.response?.data?.message)
                    }
                });
        },
        noticeError(text) {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.run(text)
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
        setPostItemId(id) {
            this.postItem.id = id;
        },
    },
    getters: {
        getAvatarUrl: (state) => {
            return state?.postItem?.avatar?.url ? state?.postItem?.avatar?.url : '/images/default-ava-5.png'
        },
    }
})
