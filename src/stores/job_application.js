import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";

export const useJobApplicationStore = defineStore('JobApplicationStore', {
    state: ()=> {
        return {
            applyButtonDisabled: null,
            newChatId: null,
            jobApplication: null,
        }
    },
    actions: {
        async applyJobApplication(e) {

            const formData = new FormData(e.target);
            if (formData.entries().next().done) {
                return;
            }

            await axios.post('/api/apply-job-application', formData)
                .then((response) => {
                    if (response.status === 201) {
                        this.applyButtonDisabled = true;

                        const noticeStore = useNoticeSuccessStore()
                        noticeStore.run()
                    }
                })
                .catch(function (error) {
                    console.log(error)
                });
        }
    },
    getters: {

    }
})
