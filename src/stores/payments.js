import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

export const usePaymentsStore = defineStore('payments', {
    state: ()=> {
        return {
            showModal: false,
            isLoading: false,
            systemWallet: '',
            transactions: [],
            userRole: String,
        }
    },
    actions: {
        setUserRole(userRole) {
            this.userRole = userRole
        },
        noticeSuccess() {
            const noticeStore = useNoticeSuccessStore()
            noticeStore.run()
        },
        noticeError(text) {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.run(text)
        },
        toggleShowModal() {
            this.showModal = !this.showModal
        },

        submitFormSystemWallet(e) {

            this.isLoading = true;
            const dataForm = new FormData(e.target);
            const response = axios.post('/api/update-system-wallet', dataForm)

            response.then(r=> {
                if (r.status === 200) {
                    this.systemWallet = r.data.number
                    this.noticeSuccess()
                }
            }).catch((error)=> {
                this.noticeError(error.response.data?.message ?? error.response.data)
            })
            this.isLoading = false;
        },
        async payedSubmit(e) {
            const dataForm = new FormData(e.target);
            await axios.post('/api/mark-payed-payment', dataForm)
                .then(r=> {

                if (r.status === 201) {
                    this.transactions.push(r.data)
                    this.noticeSuccess()
                }
            }).catch((error)=> {
                this.noticeError(error.response.data?.message ?? error.response.data)
            })
        },
        addTransaction(transaction) {
            const filteredTransactions = this.transactions.filter(item=> item.id !== transaction.id)
            filteredTransactions.push(transaction)
            this.transactions = filteredTransactions
        },
        saveWithdrawRequest(e) {
            const dataForm = new FormData(e.target);
            axios.post('/api/save-withdraw-request', dataForm)
                .then(r=> {

                    if (r.status === 201) {
                        this.transactions.push(r.data)
                        this.noticeSuccess()
                    }
                }).catch((error)=> {
                    this.noticeError(error.response.data?.message ?? error.response.data)
                })
        },
    },
    getters: {

    }
})
