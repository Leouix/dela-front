import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

export const useBalanceStore = defineStore('balance', {
    state: ()=> {
        return {
            availableBalance: null,
        }
    },
    actions: {
        getMaxAmount() {
            return this.availableBalance;
        },
        async withdrawRequest(e) {

            const dataForm = new FormData(e.target);

            await axios.post('/api/withdraw-request', dataForm)
                .then(r=> {

                  //  console.log({r})
                    if (r.status === 201) {
                       // this.transactions.push(r.data)
                        this.noticeSuccess()
                    }
                }).catch((error)=> {
                    this.noticeError(error.response.data?.message ?? error.response.data)
                })
        },
        noticeSuccess() {
            const noticeStore = useNoticeSuccessStore()
            noticeStore.run()
        },
        noticeError(text) {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.run(text)
        },
    }
})
