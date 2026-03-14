import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";

export const useTaskApplicationStore = defineStore('TaskApplicationStore', {
    state: ()=> {
        return {
            applyButtonDisabled: null,
            newChatId: null,
            taskApplication: null,
        }
    },
    actions: {
        async applyTaskApplication(e) {

            const formData = new FormData(e.target);
            if (formData.entries().next().done) {
                return;
            }

            await axios.post('/api/apply-task-application', formData)
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
