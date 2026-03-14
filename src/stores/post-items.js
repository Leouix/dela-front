import { defineStore } from 'pinia'
import {useNoticeSuccessStore} from "@/stores/notice-success.js";

export const usePostItemsStore = defineStore('postItems', {
    state: () => ({
        items: [],
        loading: false,
        error: null
    }),

    actions: {
        moderate(postItemId) {
            axios.post('/api/moderate-vacancy', {
                'post_item_id': postItemId,
            })
                .then((data) => {

                    const noticeStore = useNoticeSuccessStore()
                    noticeStore.run()
                })
                .catch((error) => {
                    this.items = []
                    this.error = 'Ошибка при загрузке объявлений'
                    console.error(error.response?.data || error)
                })
                .finally(() => {
                    this.loading = false
                })
        }
    }



})
