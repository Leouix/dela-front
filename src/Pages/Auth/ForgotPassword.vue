<script setup>
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import { Head, useForm } from '@inertiajs/vue3';
import {onMounted, ref} from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";

defineProps({
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
});

const submit = () => {
    form.post(route('password.email'));
};

const emailInput = ref(null);

onMounted(() => {
    emailInput.value?.focus();
});
</script>

<template>
    <AppLayout>
        <div class="forgot-password-area">
            <Head title="Forgot Password" />

            <div class="mb-4 text-sm text-gray-600 notice-text">
                Забыли пароль? Нет проблем. Просто сообщите нам свой адрес электронной почты,
                и мы вышлем вам ссылку для сброса пароля, которая позволит
                выбрать новый пароль.
            </div>

            <div
                v-if="status"
                class="mb-4 text-sm font-medium text-green-600"
            >
                {{ status }}
            </div>

            <form @submit.prevent="submit" class="public-form">
                <div class="input-block-flex">
                    <InputLabel for="email" value="Email" />

                    <TextInput
                        ref="emailInput"
                        id="email"
                        type="email"
                        class="mt-1 block w-full public-form-input"
                        v-model="form.email"
                        required
                        autofocus
                        autocomplete="username"
                    />

                    <InputError class="mt-2" :message="form.errors.email" />
                </div>

                <div class="mt-4 flex items-center justify-end">
                    <PrimaryButton
                        :class="{ 'opacity-25': form.processing }"
                        :disabled="form.processing"
                    >
                        Email Password Reset Link
                    </PrimaryButton>
                </div>


            </form>
        </div>
    </AppLayout>
</template>

<style scoped>

.forgot-password-area {
    max-width: 550px;
    margin: 0 auto;

    .notice-text {
        font-size: 16px;
    }

}

.input-block-flex {

    display: flex;
    gap: 10px;
    margin-top: 10px;
    flex-direction: column;

    .public-form-input {
        background: #fff;
        padding: 3px 7px;
        border-radius: 4px;
        border: none;
        box-sizing: border-box;
    }


}

button {
    margin: 10px 0;
}

</style>
