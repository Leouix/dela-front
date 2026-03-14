import {defineStore} from "pinia";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

export const useNoticeSuccessStore = defineStore('notice-success', {
    state: ()=> {
        return {
            noticeSuccessShow: false
        }
    },
    actions: {
        run() {
            this.show()
        },
        show() {
            this.noticeSuccessShow = true
            setTimeout(() => this.hide(), 2500)
        },
        hide() {
            this.noticeSuccessShow = false
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.hide()
        }
    },
    getters: {

    }
})
