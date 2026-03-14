import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

export const useWalletsStore = defineStore('wallets', {
    state: ()=> {
        return {
            showAddWalletModal: false,
        }
    },
    actions: {
        submitFormUserWallet(e) {

            const dataForm = new FormData(e.target);
            axios.post('/api/add-wallet', dataForm)
                .then(r => {
                    if (r.status === 201) {
                        this.noticeSuccess()
                        this.showAddWalletModal = false
                        // Редирект или обновление списка кошельков обычно делает Inertia
                    }
                })
                .catch((error)=> {
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
        toggleAddWalletModal() {
            this.showAddWalletModal = !this.showAddWalletModal
        },
    },

})
