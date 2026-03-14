import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

export const useImportStore = defineStore('searchFilterStore', {
    state: ()=> {
        return {
            showLinkResults: false
        }
    },
    actions: {
        formSubmit(e) {
            const dataForm = new FormData(e.target)
            const response = axios.post(
                '/api/import-candy',
                dataForm,
                {
                    headers: {
                        'Accept': 'application/json',
                    }
                })

            response.then(r=> {
                if (r.status === 200) {
                    this.noticeSuccess()
                }
            }).catch((error)=> {
                if (error.response.status === 422) {
                    this.noticeError(error.response.data?.message ?? error.response.data)
                }
            })
        },
        noticeSuccess() {
            const noticeStore = useNoticeSuccessStore()
            noticeStore.run()
            this.showLinkResults = true
        },
        noticeError(text) {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.run(text)
        },
        // formReset() {
        //     document.getElementById("filter-candidates").reset();
        // },
    },
    getters: {
        // countItems: (state) => {
        //     return state.items.length
        // },
    }
})