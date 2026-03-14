import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

export const useSupportStore = defineStore('support', {
    state: ()=> {
        return {
           showModal: false,
            form: {
                recaptchaToken: null,
            }
        }
    },
    actions: {
        toggleShowModal() {
            this.showModal = !this.showModal
        },
        submitForm(e) {

            if (!this.form.recaptchaToken) {
                alert("Пожалуйста, пройдите проверку reCAPTCHA.");
                return;
            }

            const dataForm = new FormData(e.target);
            dataForm.append( "g-recaptcha-response", this.form.recaptchaToken)

            axios.post('/api/support-email', dataForm)
                .then(r=> {
                if (r.status === 200) {
                    this.noticeSuccess()
                    this.showModal = false
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
    },
    getters: {}
})
