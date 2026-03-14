<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from "@/Layouts/AppLayout.vue";
import {useWalletsStore} from "@/stores/wallets.js";
import {useBalanceStore} from "@/stores/balance.js";

import {useUtilsStore} from "@/stores/utils.js";

const wallet = ref(null)
const withdrawTransactions = ref([])

const store = useWalletsStore();
const balanceStore = useBalanceStore();
const utils = useUtilsStore();

const user = ref(null)
const walletNumber = ref('')

async function fetchData() {
    // TODO: axios.get('/api/...')
    // wallet.value = response.data.wallet
    // withdrawTransactions.value = response.data.withdrawTransactions
    // user.value = response.data.user
}

onMounted(() => {
    fetchData()
    walletNumber.value = wallet.value?.number ?? ''
    balanceStore.availableBalance = user.value?.availableBalance ?? 0;
})

const maxAmount = ref(0);

function setMax() {
    maxAmount.value = balanceStore.getMaxAmount()
}

</script>

<template>
    
    <AppLayout>
        <h1>Вывод средств</h1>

        <div class="wallet-section">

            <h3>Номер Вашего кошелька</h3>
            <div class="notice-wallet">
                Укажите номер для вывода средств:
            </div>
            <form id="system-wallet-form" @submit.prevent="store.submitFormUserWallet">
                <input
                    name="user_wallet"
                    type="text"
                    v-model="walletNumber"
                />
                <input type="submit" value="Сохранить"/>
            </form>

        </div>

        <div class="available-balance-area">
            <p class="balance-plus">Доступно: {{user?.availableBalance}}</p>
            <div class="withdraw-area">
                <form @submit.prevent="balanceStore.withdrawRequest">
                    <input type="number" step="any" v-model="maxAmount" min="0" name="amount">
                    <div class="text-help" @click="setMax">макс.</div>
                    <input type="submit" value="Запрос на вывод">
                </form>
                <div class="withdraw-area__fee-info text-system-wallet-notice-bottom-payment">
                    Комиссия сети составит 1 USDT
                </div>

            </div>
        </div>
        <hr>

        <div class="history-transactions">
            <h3>История запросов на вывод средств</h3>
            <table class="transactions-table" >
                <thead>
                <tr>
                    <th>Дата</th>
                    <th>Номер кошелька</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th>TxId</th>
                    <th>Комментарий</th>
                </tr>
                </thead>

                <tr
                    v-for="withdrawTransaction in withdrawTransactions"
                    :key="withdrawTransaction.id"
                >
                    <td class="date-column">
                        {{utils.formatLocalTime(withdrawTransaction.created_at)}}
                    </td>

                    <td class="date-column">
                        {{withdrawTransaction.wallet_number}}
                    </td>

                    <td class="date-column">
                        {{withdrawTransaction.amount}}
                    </td>

                    <td class="date-column">
                        {{withdrawTransaction.external_transaction_status.label}}
                    </td>

                    <td class="date-column">
                        {{withdrawTransaction.txid}}
                    </td>

                    <td class="date-column">
                        {{withdrawTransaction.note}}
                    </td>

                </tr>
            </table>
        </div>


    </AppLayout>

</template>

<style scoped>

.wallet-section {


    padding: 25px;
    background: #d9d9d91f;
    max-width: 650px;
    position: relative;

    h3 {
        margin-bottom: 10px;
    }

}

.notice-wallet {
    color: #9787FF;
    font-size: 16px;
    max-width: 565px;
    margin: 10px 0;
}

#system-wallet-form {

    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;

    input[type="text"] {
        width: 100%;
        height: 30px;
        border-radius: 4px;
        outline: none;
        border: none;
        padding: 0 5px;
        font-size: 16px;

        @media screen and (min-width: 862px) {
            width: 480px;
        }
    }

    input[type="submit"] {
        margin: 0;
    }
}

.available-balance-area {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 25px;
    flex-wrap: wrap;

    .withdraw-area {
        form {
            display: flex;
            gap: 5px;
            align-items: center;
            flex-wrap: wrap;

            input[type="number"] {
                height: 30px;
                border-radius: 5px;
                font-size: 16px;
                padding: 0 5px;
            }

            .text-help {
                color: #543db2;
                font-size: 14px;
                cursor: pointer;
            }

            input[type="submit"] {
                margin: 0;
                background-color: #543db2;
            }
        }
    }
}

.history-transactions {
    margin: 15px;
    width: 100%;

    .transactions-table {
        margin: 25px 0;
        font-size: 16px;
        overflow-x: auto;
        display: block;
        td {
            border-right: 1px solid #ffffff;
            border-bottom: 1px solid #ffffff;
            padding: 0 5px;
        }
    }
}

.withdraw-area__fee-info {
    margin-top: 5px;
}

</style>
