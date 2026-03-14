<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from "@/Layouts/AppLayout.vue";
import {usePaymentsStore} from "@/stores/payments.js";
import {useWalletsStore} from "@/stores/wallets.js";

import {useUtilsStore} from "@/stores/utils.js";
import AddWalletModal from "@/components/AddWalletModal.vue";

import axios from "axios";

const store = usePaymentsStore();
const walletStore = useWalletsStore();

const systemWallet = ref('')
const transactions = ref(null)
const amountPayment = ref(null)
const wallets = ref(null)

const is_admin = ref(false)

const user = ref(null)
const userRole = ref(null)

const util = useUtilsStore();

async function fetchData() {
    const response = await axios.post('/api/top-up-balance')
    systemWallet.value = response.data.systemWallet
    transactions.value = response.data.transactions
    wallets.value = response.data.wallets
}

onMounted(() => {
    fetchData()
    store.systemWallet = systemWallet.value
    store.transactions = transactions.value
    store.setUserRole(userRole.value)
})

const copyButton = ref();
const copyButtonMobile = ref();

async function copySystemWallet() {
    const textToCopy = store.systemWallet;

    try {
        await navigator.clipboard.writeText(textToCopy);
        copyButton.value?.classList.add("active")
        copyButtonMobile.value?.classList.add("active")
        setTimeout(() => copyButton.value?.classList.remove("active"), 1500);
    } catch (err) {
        console.error('Не удалось скопировать текст: ', err);
    }
}

const statusClass = (transaction) => {

    const statusName = transaction.transaction_status.name;
    const classes = ['status-column'];

    if (statusName === 'failed') {
        classes.push('status-failed')
    }

    if (statusName === 'success') {
        classes.push('status-success')
    }

    return classes;
}

</script>

<template>
    
    <AppLayout>
        <h1>Пополнение баланса</h1>

        <a class="payment-instructions" href="/how-to-pay">Инструкция "Как пополнить баланс с Bybit"</a>

        <div v-if="is_admin" class="wallet-section system-wallet">

            <h2>Номер кошелька системы</h2>

            <form id="system-wallet-form" @submit.prevent="store.submitFormSystemWallet">
                <input
                    name="system_wallet"
                    type="text"
                    v-model="store.systemWallet"
                />
                <input type="submit" value="Сохранить"/>
            </form>
        </div>


        <div class="wallet-section-header" v-if="false">
            <h2>Номер вашего кошелька</h2>
            <div id="add-wallet-button" class="add-wallet-button" @click="walletStore.toggleAddWalletModal()">
                <span>Добавить</span>
            </div>
        </div>


        <div class="wallets" v-if="false">
            <div v-for="wallet in wallets" :key="wallet.id" class="wallet">
                <div class="wallet-remove-icon"></div>
                <div class="wallet-number">{{ wallet.number }}</div>
                <div class="wallet-current-icon"></div>
            </div>
        </div>

        <AddWalletModal  v-if="false" />


        <button class="done-payed" v-if="false">
            Я оплатил
        </button>


        <div v-if="store.userRole === 'company'" class="wallet-section">
            <p>Обеспечительный платеж по задаче:</p>
            <div class="text-system payment-address-area">

                <div class="payment-address-area__content">
                    <div class="text-system-wallet-notice payment-address-area__content_item">
                        Переведите нужную сумму USDT в сети TRX (TRC20) на указанный адрес:
                    </div>

                    <div class="wallet-container payment-address-area__content_item" @click="copySystemWallet">
                        <div id="systemWalletCode" class="text-system-wallet">
                            {{ store.systemWallet }}
                        </div>
                        <div id="copyButton" class="copy-icon-button" title="Копировать" ref="copyButton">
                            <div class="copy-icon"></div>
                            <div class="copied">Copied</div>
                        </div>

                    </div>
                    <div class="to-copy-mobile payment-address-area__content_item" @click="copySystemWallet"
                         ref="copyButtonMobile">
                        Скопировать
                        <div class="copied">Copied</div>
                    </div>

                    <div
                        class="text-system-wallet-notice text-system-wallet-notice-bottom  payment-address-area__content_item">
                        ⚠️ Минимальная сумма пополнения — стоимость вашей задачи - 2$ + 5% от стоимости задачи.
                    </div>

                    <div v-if="amountPayment"
                         class="text-system-wallet-notice-bottom-payment  payment-address-area__content_item">
                        Рекомендуемая сумма оплаты: {{ amountPayment }} USDT
                    </div>
                </div>

                <div class="payment-address-area__qr">
                    <div class="qr-group">
                        <div class="tron-usd-label">
                            <img class="usd-tron-icon" src="/images/UsdTron.svg" alt="tron-wallet">
                            <div>USDT</div>
                            <div class="net-label">Tron</div>
                        </div>
                        <img class="tron-wallet-qr" src="/images/qr.png" alt="tron-wallet">
                    </div>
                </div>

            </div>

            <h4>
                После отправки средств:
            </h4>
            <ul class="payment-actions">
                <li>
                    Дождитесь подтверждения транзакции вашего платежа в сети.
                </li>
                <li>
                    Укажите Hash транзакции (TxID) в поле ниже.
                </li>
                <li>
                    Нажмите кнопку «Подтвердить».
                </li>
            </ul>

            <form @submit.prevent="store.payedSubmit">

                <input id="input-transaction" type="text" name="transaction_id" placeholder="Hash транзакции (TxID)">
                <input type="submit" class="done-payed" value="Подтвердить">
            </form>

            <div v-if="store.isLoading" class="wallet-section-loading" style="display:none;"></div>
        </div>

        <div>
            <h2>История пополнений</h2>
        </div>

        <div class="transaction-list">

            <table class="data-table">
                <thead>
                <tr>
                    <th>Создан</th>
                    <th>TxID</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                </tr>
                </thead>

                <tr
                    v-for="(transaction, index) in (store.transactions ?? [])"
                    :key="transaction.id"
                    :class="{ 'even-row': index % 2 === 0, 'odd-row': index % 2 !== 0 }"
                >

                    <td class="date-column">
                        {{ util.formatLocalTime(transaction.created_at) }}
                    </td>

                    <td class="link-column">
                        <a :href="`https://tronscan.io/#/transaction/${transaction.TxID}`" target="_blank" rel="noopener noreferrer">
                            {{ transaction.TxID }}
                        </a>
                    </td>

                    <td>
                        <span v-if="transaction.amount">
                          {{ transaction.amount }}
                        </span>
                        <span v-else class="text-gray-400 italic">нет данных</span>
                    </td>

                    <td :class="statusClass(transaction)">
                        {{ transaction.transaction_status.label }}
                    </td>
                </tr>
            </table>

        </div>
    </AppLayout>

</template>

<style scoped>

.wallet-section {
    padding: 10px 0;

    max-width: 870px;
    position: relative;
    margin-bottom: 15px;
    border-radius: 2px;

    @media screen and (min-width: 480px) {
        padding: 25px;
    }

    h2 {
        font-weight: 400;
        font-size: 20px;
        margin: 0 0 10px;
    }

    @media screen and (min-width: 480px) {
        font-size: 22px;
    }

    &.system-wallet {
        form {

            display: flex;
            flex-direction: column;
            gap: 10px;
            @media screen and (min-width: 480px) {
                flex-direction: row;
            }


            input[type="text"] {
                max-width: 450px;
                width: 100%;
                padding: 5px 5px;
                font-size: 11px;
                border-radius: 2px;
                border: none;
                outline: none;

                @media screen and (min-width: 480px) {
                    font-size: 16px;
                }
            }


            input[type="submit"] {
                margin: 0;

                @media screen and (min-width: 480px) {
                    margin: 0 15px;
                }
            }
        }
    }

    .wallet-section-loading {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-size: 10%;
        background: #ffffff7d url("/images/icons/spinner.gif") no-repeat center;
        box-shadow: 0 0 2px #ffffff;
    }

    form {
        input.done-payed {
            text-transform: uppercase;
            background: #198619;
            height: 40px;
            border-radius: 2px;
            font-size: 14px;
            margin: 10px 0;
            width: 100%;

        }

        input[type="text"] {
            width: 100%;
            border: none;
            outline: none;
            background: #ccc;
            border-radius: 2px;
            padding: 8px 10px;
            font-size: 14px;
            box-sizing: border-box;
            margin-top: 5px;
        }
    }

}

.text-system {
    padding: 0;
    margin-top: 5px;
    margin-bottom: 20px;
    border-radius: 2px;

    @media screen and (min-width: 480px) {
        background: #2d2d2d;
        padding: 15px 10px;
    }

    .text-system-wallet {
        max-width: 500px;
        font-size: 11px;
        width: 100%;

        @media screen and (min-width: 480px) {
            font-size: 14px;
        }
    }
}

.text-system-wallet-notice {
    max-width: 530px;
    line-height: 20px;
    font-size: 14px;

    span {
        color: #9787FF;
    }
}

.wallet-container {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    padding: 3px;
    cursor: pointer;
    max-width: 550px;

    @media screen and (min-width: 480px) {
        padding: 0 5px;
    }

    div.copy-icon-button {
        background: none;
        border: none;
        padding: 5px;
        font-size: 15px;
        color: #8db1e7;
        transition: color 0.2s;
        position: relative;
        margin: 0;
        display: none;

        @media screen and (min-width: 480px) {
            display: block;
        }

        div.copy-icon {
            width: 20px;
            height: 20px;
            background: url("/images/icons/copy.svg") no-repeat;
            background-size: cover;
        }

        div.copied {
            display: none;
            position: absolute;
            top: -25px;
            right: -25px;
        }

        &.active {
            div.copied {
                display: block;
            }
        }
    }
}

.to-copy-mobile {
    display: block;
    text-align: center;
    font-size: 11px;
    border-bottom: 1px solid #ffffff70;
    width: 65px;
    margin: 5px auto;
    text-transform: lowercase;

    @media screen and (min-width: 480px) {
        display: none;
    }
}

.text-system-wallet {
    margin: 0;
    font-family: monospace;
    padding: 0 5px;
}

.to-copy-mobile {
    display: block;
    text-align: center;
    font-size: 11px;
    border-bottom: 1px solid #ffffff70;
    width: 65px;
    margin: 5px auto;
    text-transform: lowercase;
    position: relative;

    @media screen and (min-width: 480px) {
        display: none;
    }

    div.copied {
        display: none;
        position: absolute;
        top: 0;
        left: -55px;
        font-size: 15px;
        color: #8db1e7;
        transition: color 0.2s;
    }

    &.active {
        div.copied {
            display: block;
        }
    }
}

.transaction-list {

    overflow-x: auto;
}


.data-table {

    width: 100%;
    font-size: 14px;
    border-collapse: collapse;

    thead tr th {
        border-bottom: 1px solid #ffffff33;
    }

    tr:last-child {
        border-bottom: 1px solid #ffffff33;
    }

    th {
        font-weight: bold;
        text-transform: uppercase;
        padding: 5px;
    }

    td {
        padding: 5px;
        border-right: 1px solid #ffffff33;
        border-left: 1px solid #ffffff33;

    }

    td.date-column {
        width: 100px;
        text-align: center;
        min-width: 100px;
    }

    .status-column {
        text-align: center;
    }

    .link-column {
        text-decoration: underline;
        white-space: nowrap;

        a:after {
            content: '';
            width: 15px;
            height: 15px;
            background: url("/images/icons/link.svg") no-repeat;
            background-size: cover;
            display: inline-block;
            margin-left: 5px;
        }
    }

    .odd-row {
        background-color: #363434;
    }
}

.status-column.status-failed {
    color: red;
}

.status-column.status-success {
    color: green;
}

.usd-tron-icon {
    width: 35px;
    height: 35px;
}

.tron-usd-label {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 15px;
}

.tron-wallet-qr {
    max-width: 150px;
    margin: 0 15px;
}

.net-label {
    background: #484848ad;
    border-radius: 4px;
    padding: 1px 7px;
}

.payment-address-area {
    display: flex;

    justify-content: space-around;
    flex-direction: column;

    @media screen and (min-width: 769px) {
        flex-direction: row;
        align-items: center;
    }
}

.wallet-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 870px;
}

.add-wallet-button {
    background: #0081ff;
    padding: 2px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
        background: #0060bd;
    }
}

.payment-address-area__content_item {
    margin-top: 15px;
    margin-bottom: 15px;
}

.payment-instructions {
    background: #b7ffcd1f;
    padding: 6px 15px;
    border-radius: 8px;
    font-size: 14px;
    text-decoration: underline;
}
</style>
