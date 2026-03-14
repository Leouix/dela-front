<script setup>
import { computed } from 'vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from "@/Layouts/AppLayout.vue";

const props = defineProps({
    status: {
        type: String,
    },
});

const form = useForm({});

const submit = () => {
    form.post(route('verification.send'));
};

const verificationLinkSent = computed(
    () => props.status === 'verification-link-sent',
);
</script>

<template>
    <AppLayout>

        <div class="dialog-window dialog-window-verify-email">
            <Head title="Верификация аккаунта" />

            <div class="mb-4 text-sm text-gray-600 notice-text">
                Спасибо за регистрацию! Прежде чем начать, подтвердите, пожалуйста, свой
                адрес электронной почты, перейдя по ссылке, которую мы вам только что отправили.
            </div>

            <div
                class="mb-4 text-sm font-medium text-green-600 notice-text"
                v-if="verificationLinkSent"
            >
                Новая ссылка для подтверждения была отправлена на адрес электронной почты, указанный вами при регистрации.
            </div>

            <form @submit.prevent="submit" class="login-form">
                <div class="mt-4 flex items-center justify-between">
                    <PrimaryButton
                        :class="{ 'opacity-25': form.processing }"
                        :disabled="form.processing"
                    >
                        Отправить новое письмо верификации
                    </PrimaryButton>

                    <Link
                        :href="route('logout')"
                        method="post"
                        as="button"
                        class="verify-logout-link"
                    >Log Out</Link
                    >
                </div>
            </form>
        </div>

    </AppLayout>
</template>

<style scoped>
.dialog-window {

    max-width: 550px;
    margin: 0 auto;

    .notice-text {
        font-size: 16px;
        margin: 15px 0;
    }



    .verify-logout-link {
        background: transparent;
        border: none;
        text-decoration: underline;
    }
}

.login-form {

    button {
        margin: 15px 0;
    }

    .flex {
        flex-wrap: wrap;
        gap: 5px;
        flex-direction: column;
    }
}
</style>
