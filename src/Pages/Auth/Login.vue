<script setup>
import Checkbox from '@/components/Checkbox.vue';
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';
import {Head, Link, useForm} from '@inertiajs/vue3';
import AppLayout from "@/Layouts/AppLayout.vue";
import {route} from "ziggy-js";
import {ref} from "vue";

defineProps({
    canResetPassword: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const showPassword = ref(false);

const submit = () => {
    form.post(route('login.store'), {
        onSuccess: (response) =>   window.location.href = response.url,
        onFinish: () => form.reset('password'),
    });
};


const loginWithGoogle = () => {
    window.location.href = `/auth/google/redirect`;
}

const loginWithGithub = () => {
    window.location.href = `/auth/github/redirect`;
}
</script>

<template>
    <Head title="Войти" />
    <AppLayout>

            <div v-if="status" class="mb-4 text-sm font-medium text-green-600">
                {{ status }}
            </div>

        <div class="social-auth-block">
            <PrimaryButton type="button" class="ms-4 social-authorize" @click="loginWithGoogle">
                <span class="social-authorize-google"></span>Google авторизация
            </PrimaryButton>

            <PrimaryButton type="button" class="ms-4 social-authorize" @click="loginWithGithub">
                <span class="social-authorize-github"></span>GitHub авторизация
            </PrimaryButton>
        </div>

            <form class="form-login-register" @submit.prevent="submit">

                <h1>Вход в аккаунт</h1>
                <div>
                    <InputLabel for="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        class="mt-1 block w-full"
                        v-model="form.email"
                        required
                        autofocus
                        autocomplete="username"
                    />

                    <InputError class="mt-2 text-error" :message="form.errors.email" />
                </div>

                <div class="mt-4">
                    <InputLabel for="password" value="Пароль" />

                    <div class="relative">
                        <TextInput
                            id="password"
                            :type="showPassword ? 'text' : 'password'"
                            class="mt-1 block w-full"
                            v-model="form.password"
                            required
                            autocomplete="current-password"
                        />

                        <div :class="['toggle-visibility', showPassword ? 'password-hide' : 'password-show']"
                             @click="showPassword = !showPassword"
                        ></div>
                    </div>


                    <InputError class="mt-2 text-error" :message="form.errors.password" />
                </div>

                <div class="mt-4 block">
                    <label class="flex items-center">
                        <Checkbox name="remember" v-model:checked="form.remember" />
                        <span class="ms-2 text-sm text-gray-600"
                        >Запомнить меня</span
                        >
                    </label>
                </div>

                <div class="mt-4 flex items-center justify-between forgot-password">
                    <Link
                        v-if="canResetPassword"
                        :href="route('password.request')"
                        class="rounded-md text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >

                        Забыли пароль?
                    </Link>

                    <Link
                        :href="route('register')"
                        class="rounded-md text-sm underline  focus:outline-none"
                    >
                        Регистрация
                    </Link>

                    <PrimaryButton
                        class="ms-4"
                        :class="{ 'opacity-25': form.processing }"
                        :disabled="form.processing"
                    >
                        Войти
                    </PrimaryButton>
                </div>
            </form>

    </AppLayout>

</template>

<style scoped>
.form-login-register {

    background: #686767;
    border-radius: 10px;
    max-width: 490px;
    margin: 0 auto;
    color: #eeeeee;
    font-size: 18px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    h1 {
        margin: 0 0 5px;
        color: #ffffff;
    }

    input {
        color: #000;
        border-radius: 4px;
        border: none;
        padding: 5px 10px;
        font-size: 16px;
        margin: 5px 0;
        box-sizing: border-box;

        &[type="radio"] {
            margin: 5px;
        }

        &[type="checkbox"] {
            margin: 5px 5px 5px 0;
        }
    }

    p {
        font-size: 14px;
    }

    .forgot-password a {
        font-size: 14px;
    }
}


</style>
