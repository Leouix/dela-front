<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {useUtilsStore} from "@/stores/utils.js";
import {usePaymentsStore} from "@/stores/payments.js";
import {Head} from "@inertiajs/vue3";

const props = defineProps({
    withdrawRequests: Object,
});
const utils = useUtilsStore();

const store = usePaymentsStore();

const getLabelStatus = (externalTransactionStatus) => {
    const map = {
        processing: 'В обработке',
        done: 'Исполнен',
        fail: 'Ошибка'
    };

    return map[externalTransactionStatus];
}


</script>

<template>
    <Head title="Админ запросы на вывод" />
    <AppLayout>

        ID/ Дата создания/ Юзер/ Сумма/ Номер кошелька/ Статус/ TxId/ Комментарий

        <form v-for="withdrawRequest in withdrawRequests"
              class="withdraw-requests-form"
              :key="withdrawRequest.id"
              @submit.prevent="store.saveWithdrawRequest"
        >
            <div class="form-item">{{withdrawRequest.id}}</div>
            <div class="form-item">{{utils.formatLocalTime(withdrawRequest.created_at)}}</div>
            <div class="form-item">{{withdrawRequest.to.email}}</div>
            <div class="form-item">{{withdrawRequest.amount}}</div>
            <div class="form-item">{{withdrawRequest.wallet_number}}</div>

            <input type="hidden" name="external_transaction_id" :value="withdrawRequest.id">
            <select name="external_transaction_status">
                <option :value="withdrawRequest.external_transaction_status.name">{{withdrawRequest.external_transaction_status.label}}</option>
                <option
                    v-for="status in ['processing', 'done', 'fail'].filter(s => s !== withdrawRequest.external_transaction_status.name)"
                    :key="status"
                    :value="status"
                >
                    {{ getLabelStatus(status) }}
                </option>
            </select>

            <input type="text" name="txid" :value="withdrawRequest.txid" placeholder="TxID">
            <input type="text" name="note" :value="withdrawRequest.note" placeholder="note">

            <input type="submit" value="Save">
        </form>
    </AppLayout>
</template>

<style scoped>
.withdraw-requests-form {
    display: flex;
    align-items: center;
    gap: 5px;

    select {
        height: 35px;
        color: #fff;
    }

    option {
        height: 35px;
        color: #000000;
    }

    input {
        height: 35px;
    }

    .form-item {
        border-left: 1px solid #fff;
        border-bottom: 1px solid #fff;
        padding: 0 5px;
    }
}
</style>
