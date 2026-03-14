<script setup>
import {useHeaderStore} from "@/stores/header.js";
import MobileMenu from "@/components/MobileMenu.vue";
import SupportModal from "@/components/SupportModal.vue";
import {computed} from "vue";
import ToggleUserModeSmall from "@/components/ToggleUserModeSmall.vue";
import {useWindowSize} from "@/stores/windowSize.js";
import Auth from "@/components/Auth.vue";

const store = useHeaderStore();

const user = null;
const userRole = null;

const { width } = useWindowSize()

const isMobileSize = computed(() => width.value < 769)

</script>

<template>

        <div class="header-area">

            <div class="logo-block">
                <div id="logo-text"><a href="/">DelaDela</a></div>
                <div class="sub-title">Удаленная работа</div>
            </div>

            <div class="header-right">

                <toggle-user-mode-small v-if="isMobileSize && userRole" :userRole="userRole" :isMobile="true"/>

                <div class="dashboard-top">

                    <SupportModal v-if="!isMobileSize"/>

                    <a href="/balance">
                        <div class="wallet-area">
                            <img src="/images/icons/wallet-icon-1.svg" alt="wallet">
                            <div v-if="user" class="balances">
                                <div class="balance-available">{{ user?.availableBalance }}</div>
                                <div  v-if="user.mode === 'company'">/</div>
                                <div v-if="user.mode === 'company'" class="balance-total">{{ user?.balance_total?.amount }}</div>
                            </div>
                        </div>
                    </a>

                    <auth/>

                </div>

                <a href="/balance" class="mobile-balance">
                    <div class="wallet-area">
                        <img src="/images/icons/wallet-icon-1.svg" alt="wallet">
                        <div v-if="user" class="balances">
                            <div class="balance-available">{{ user?.availableBalance }}</div>
                            <div  v-if="user.mode === 'company'">/</div>
                            <div v-if="user.mode === 'company'" class="balance-total">{{ user?.balance_total?.amount }}</div>
                        </div>
                    </div>
                </a>

                <div id="open-menu-button" @click="store.toggleMobileMenu"></div>

                <mobile-menu v-if="store.showMobileMenu && isMobileSize"/>

            </div>

        </div>

</template>

<style>


#open-menu-button {
    cursor: pointer;
}

.wallet-area {
    display: flex;
    align-items: center;
    gap: 5px;

    .balances {
        display: flex;
        font-size: 14px;

        @media screen and (min-width: 340px) {
            font-size: 16px;
        }
        .balance-available {
            color: green;
            margin-right: 3px;
            text-decoration: underline;
        }

        .balance-total {
            margin-left: 3px;
            text-decoration: underline;
        }
    }
}

.dashboard-top-item-logout {
    margin-left: 15px;
}

.mobile-balance {
    display: flex;
    margin-right: 15px;
    @media screen and (min-width: 550px) {
        display: none;
    }
}


.mode-select {
    color: #cacaca;
}
</style>
