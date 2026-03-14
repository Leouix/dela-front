<script setup>
import {ref, watch, nextTick, onUnmounted, onMounted} from 'vue';
import { useSupportStore } from '@/stores/support.js';
import { getUsePage } from '@/composables/usePage.js';

const store = useSupportStore();
const page  = getUsePage();

window.onVerify = token => (store.form.recaptchaToken = token);

const makeId = () =>
    'recaptcha-' + Math.random().toString(36).slice(2, 9);

const renderRecaptcha = id => {
    const el = document.getElementById(id);
    if (el && window.grecaptcha) {
        window.grecaptcha.render(id, {
            sitekey : page.props.recaptcha_site_key,
            callback: onVerify,          // передаём саму функцию
            theme   : 'light',
            size    : 'normal',
        });
    }
};

const recaptchaId = ref('');      // всегда свежий id

const modalRef = ref(null);
const supportButtonRef = ref(null);
const handleClickOutside = (e) => {

    if (modalRef.value
        && !modalRef.value.contains(e.target)
        && !supportButtonRef.value.contains(e.target)) {

        store.showModal = false;
    }
};

watch(
    () => store.showModal,
    async opened => {
        if (!opened) return;          // закрылась — ничего не делаем

        recaptchaId.value = makeId(); // новый контейнер → новый id
        await nextTick();             // ждём появления div в DOM

        // если скрипт reCAPTCHA ещё не успел загрузиться
        if (!window.grecaptcha) {
            const timer = setInterval(() => {
                if (window.grecaptcha) {
                    clearInterval(timer);
                    renderRecaptcha(recaptchaId.value);
                }
            }, 50);
        } else {
            renderRecaptcha(recaptchaId.value);
        }
    },
    { immediate: false }
);

onMounted(() => {
    document.addEventListener('click', (e) => {
        handleClickOutside(e)
    })
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

</script>

<template>


    <div id="support-flag" class="dashboard-top-item dashboard-top-item-support" >
        <div id="support-button" class="block" @click="store.toggleShowModal()" ref="supportButtonRef">
            <div class="icon-support"></div>
            <div class="text">Support</div>
        </div>
    </div>

    <Transition >
        <div v-if="store.showModal" class="modal-mask" >
            <div id="support-modal" class="modal-container" ref="modalRef" >

                <div class="support-modal-close" @click="store.showModal = false"></div>

                <div class="modal-header">
                    <h2 class="text-lg font-medium text-gray-900">Напишите в поддержку:</h2>
                </div>

                <div class="modal-body">
                    <form id="support-form" @submit.prevent="store.submitForm">
                        <textarea name="text_message" class="support-textarea" rows="7"></textarea>
                        <input
                            name="email_message"
                            type="text"
                            placeholder="Ваш емейл"
                        />

                        <div :id="recaptchaId" class="g-recaptcha"></div>

                        <input type="submit" value="Отправить" />
                    </form>
                </div>

                <div class="modal-footer">
                </div>
            </div>
        </div>
    </Transition>
</template>
