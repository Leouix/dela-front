<script setup>
import {ref, onUnmounted, onMounted} from 'vue';
import { useWalletsStore } from '@/stores/wallets.js';

const store = useWalletsStore();

const modalRef = ref(null);
const addWalletButtonRef = ref(null);

const handleClickOutside = (e) => {
    if (modalRef.value
        && !modalRef.value.contains(e.target)
        && (addWalletButtonRef.value && !addWalletButtonRef.value.contains(e.target))) {
        store.showAddWalletModal = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    // Находим кнопку открытия модалки, если она есть в DOM,
    // чтобы исключить её из handleClickOutside
    addWalletButtonRef.value = document.getElementById('add-wallet-button');
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

</script>

<template>
    <Transition>
        <div v-if="store.showAddWalletModal" class="modal-mask">
            <div id="add-wallet-modal" class="modal-container" ref="modalRef">

                <div class="support-modal-close" @click="store.showAddWalletModal = false"></div>

                <div class="modal-header">
                    <h2>Добавить кошелек</h2>
                </div>

                <div class="modal-body">
                    <form id="add-wallet-form" @submit.prevent="store.submitFormUserWallet">
                        <input
                            name="new_wallet"
                            type="text"
                            placeholder="Номер вашего кошелька (TRC20)"
                            required
                        />
                        <input type="submit" value="Добавить" />
                    </form>
                </div>

                <div class="modal-footer">
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
#add-wallet-form {
    display: flex;
    flex-direction: column;
}
</style>
