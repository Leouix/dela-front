import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";
import {useNoticeErrorStore} from "@/stores/notice-error.js";


export const useTaskOrderStore = defineStore('taskOrderStore', {
    state: () => {
        return {
            item: null,
            deadlineStatistics: null,
            orderStatusActionTypes: null,
            loading: false,
        }
    },
    actions: {
        noticeSuccess() {
            const noticeStore = useNoticeSuccessStore()
            noticeStore.run()
        },
        noticeError(text) {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.run(text)
        },
        async create(taskApplication) {

            const formData = new FormData();
            formData.append('user_candidate_id', taskApplication.userCandidate.id)
            formData.append('task_application_id', taskApplication.id)

            await axios.post('/api/create-task-order', formData)
                .then((response) => {
                    if (response.status === 200) {
                        this.noticeSuccess()
                    }
                })
                .catch((error) => {
                    this.noticeError(error.response.data?.message ?? error.response.data)
                });
        },
        async setDeadline(e) {

            const formData = new FormData(e.target)

            const days = Number(formData.get('days'));

            // ✅ Валидация: число, минимум 1
            if (isNaN(days) || days < 1) {
                this.noticeError("Количество дней должно быть не меньше 1");
                return;
            }

            formData.append('task_order_id', this.item.id)

            await axios.post('/api/update-deadline-task-order', formData)
                .then((response) => {
                    if (response.status === 200) {
                        this.noticeSuccess();
                        this.item.deadline = response.data.deadline;
                        this.deadlineStatistics.push(response?.data.deadlineStatistic);
                    }
                })
                .catch((error) => {
                    this.noticeError(error.response.data?.message ?? error.response.data)
                });
        },
        async changeStatusSubmit(action) {

            this.loading = true;

            const data = new FormData();
            data.append('action', action)
            data.append('task_order_id', this.item.id)

            await axios.post("/api/task-order/change-status", data)
                .then(response => {
                    if (response.status === 200) {
                        this.noticeSuccess();
                        this.loading = false;
                    } else  {
                        this.noticeError('Ошибка статуса задачи')
                    }
                });
        },
        connectTaskOrdersChannel(userRole, taskOrders) {

            if (userRole === 'company') {
                taskOrders?.forEach(taskOrder => {
                    this.connectCustomerStatusChannel(taskOrder.id);
                });
            } else if (userRole === 'candidate') {
                taskOrders?.forEach(taskOrder => {
                    this.connectSpecialistStatusChannel(taskOrder.id);
                });
            }
        },
        connectSpecialistStatusChannel(taskOrderId) {
            const channelTaskOrder = window.Echo.private(`specialist.change.status.channel.${taskOrderId}`);

            channelTaskOrder.listen('SpecialistStatusChangeEvent', (e) => {

                if (this.item !== null) {
                    this.item.orderStatusType = e.taskOrder.order_status_type;
                }

                if (this.orderStatusActionTypes !== null) {
                    this.orderStatusActionTypes = e.orderStatusActionTypes;
                }
            });
        },
        connectCustomerStatusChannel(taskOrderId) {

            const channelTaskOrder = window.Echo.private(`customer.change.status.channel.${taskOrderId}`);

            channelTaskOrder.listen('CustomerStatusChangeEvent', (e) => {

                if (this.item !== null) {
                    this.item.orderStatusType = e.taskOrder.order_status_type;
                }

                if (this.orderStatusActionTypes !== null) {
                    this.orderStatusActionTypes = e.orderStatusActionTypes;
                }
            });
        },
        async saveNotes(e) {

            const formData = new FormData(e.target);
            await axios.post('/api/my/company/save-notes-task-order', formData)
                .then((response) => {
                    if (response.status === 200) {
                        this.noticeSuccess()
                    }
                })
                .catch((error) => {
                    this.noticeError(error.response.data?.message ?? error.response.data)
                });
        },
    },
    getters: {
        getIsItemClosed() {
            return this.item.orderStatusType.name === 'done'
                || this.item.orderStatusType.name === 'not_done_closed'
                || this.item.orderStatusType.name === 'completed_moderator_to_specialist'
                || this.item.orderStatusType.name === 'completed_moderator_to_customer';
        }
    }
})
