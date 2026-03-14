import {defineStore} from "pinia";

export const useNoticeErrorStore = defineStore('notice-error', {
    state: ()=> {
        return {
            noticeErrorShow: false,
            noticeText: 'Failed!'
        }
    },
    actions: {
        run(text) {
            this.noticeText = text
            this.show()
        },
        show() {
            this.noticeErrorShow = true
         //   setTimeout(() => this.hide(), 5500)
        },
        hide() {
            this.noticeErrorShow = false
        }
    },
    getters: {}
})
