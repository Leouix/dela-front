import { defineStore } from 'pinia'
import {useNoticeSuccessStore} from "@/stores/notice-success.js";

export const useTasksStore = defineStore('tasksStore', {
    state: () => ({
        items: [],
        loading: false,
        error: null,
        isFavoriteTask: null,
    }),

    actions: {
        moderate(taskId) {
            axios.post('/api/moderate-task', {
                'task_id': taskId,
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
        },
        toggleFavorite(taskId) {
            this.isFavoriteTask = !this.isFavoriteTask
            axios.post('/api/toggle-favorite-task', {
                taskId: taskId
            })
        },
    }



})
