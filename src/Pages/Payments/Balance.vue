<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from "@/Layouts/AppLayout.vue";

import {useUtilsStore} from "@/stores/utils.js";
import {useBalanceStore} from "@/stores/balance.js";

import axios from "axios";

const balanceReserved = ref([])
const transactions = ref([])
const balanceReservedAmount = ref(0)

const store = useBalanceStore();

const user = ref(null)

const util = useUtilsStore();

async function fetchData() {
    const response = await axios.post('/api/balance')
    balanceReserved.value = response.data.balanceReserved
    balanceReservedAmount.value = response.data.balanceReservedAmount
}

onMounted(() => {
    fetchData()
    store.availableBalance = user.value?.availableBalance ?? 0;
})

</script>

<template>
    
    <AppLayout>

        <div class="payments-content">
            <h1>Баланс</h1>

            <div class="balance-area-header">
                <div>

                    <div class="available-balance-area">
                        <p class="balance-plus">Доступно: {{user?.availableBalance}}</p>
                    </div>

                    <p v-if="user?.mode === 'company'" class="balance-minus">Общая сумма баланса: {{user?.balance_total?.amount ?? 0}}</p>
                </div>
                <div class="balance-area" >
                    <div v-if="user?.mode === 'company'" class="top-up-balance">
                        <p><a href="/top-up-balance">Пополнить баланс</a><img src="/images/icons/arrow-top-up.svg" alt="top-up-balance"></p>
                    </div>
                    <div class="withdraw-balance">
                        <p><a href="/withdraw">Вывод средств</a><img src="/images/icons/withdraw-cash-icon.svg" alt="withdraw"></p>
                    </div>
                </div>
            </div>

            <div v-if="user?.mode === 'company'" class="balance-reserve">
                <p >Резерв по задачам: {{balanceReservedAmount}}</p>

                <table class="data-table reserved-table">
                    <thead>
                    <tr>
                        <th>Сумма</th>
                        <th>Задача</th>
                    </tr>
                    </thead>

                    <tr
                        v-for="(balanceReservedItem) in balanceReserved"
                        :key="balanceReservedItem.id"
                    >
                        <td class="date-column">
                            {{balanceReservedItem.amount}}
                        </td>
                        <td class="date-column">
                            <a :href="`/task-order/`+balanceReservedItem.task_order.slug">
                                {{util.previewText(balanceReservedItem.task_order.task_application.task.title, 50)}}
                            </a>
                        </td>
                    </tr>
                </table>

            </div>

            <div>
                <h2>История переводов:</h2>
            </div>

            <div class="transaction-list">

                <table class="data-table">
                    <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Задача</th>
                        <th>Комиссия</th>
                        <th>Назначение перевода</th>
                    </tr>
                    </thead>

                    <tr
                        v-for="(customerTransaction) in transactions"
                        :key="customerTransaction.id"
                    >

                        <td class="date-column">
                            {{ customerTransaction.created_at }}
                        </td>

                        <td :class="['date-column', customerTransaction.cssClass]">
                            {{customerTransaction.amount}}
                        </td>

                        <td>
                            <a v-if="customerTransaction?.task_order?.task_application?.task?.title" :href="`/task-order/`+customerTransaction.task_order.slug">{{util.previewText(customerTransaction.task_order.task_application.task.title, 50)}}</a>
                        </td>

                        <td>
                            {{customerTransaction?.fee ?? '-'}}
                        </td>

                        <td>
                            {{customerTransaction.appointment}}
                        </td>
                    </tr>
                </table>

            </div>
        </div>
    </AppLayout>

</template>

<style scoped>

.payments-content {
    max-width: 1065px;
    margin-left: 0;
    @media screen and (min-width: 1200px) {
        margin-left: 55px;
    }

}
.balance-area-header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-direction: column-reverse;

    @media screen and (min-width: 520px) {
        flex-direction: row;
    }

    .balance-area {

        p {
            display: flex;
            align-items: center;
            justify-content: end;

            img {
                width: 20px;
                margin-left: 5px;
                margin-bottom: 2px;
            }

            a {
                text-decoration: underline;
            }
        }
    }
}

.reserved-table {
    margin: 20px;
    border-bottom: 1px solid #aa863f;

    a {
        text-decoration: underline;
    }
    th {
        border-bottom: 1px solid #aa863f;
    }
}

.balance-minus {
    color: #6060e0;
}

.balance-plus {
    color: #3ba03b;
}

.balance-reserve {
    color: #aa863f;
}
.transaction-list {

    border-collapse: collapse;
    width: 100%;
    overflow-x: auto;

    table {

        .date-column {
            font-size: 16px;
            text-align: center;
        }

        th {
            border: 1px solid #ffffff63;
            border-left: none;
            padding: 3px 10px;

            &:first-child {
                border-left: 1px solid #ffffff63;
            }
        }

        td {
            border-bottom: 1px solid #ffffff63;
            border-right: 1px solid #ffffff63;
            padding: 3px 10px;

            &:first-child {
                border-left: 1px solid #ffffff63;
            }
            a {
                text-decoration: underline;
            }
        }
    }

}

</style>
