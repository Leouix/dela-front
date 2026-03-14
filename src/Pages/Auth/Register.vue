<script setup>
import InputError from '@/components/InputError.vue';
import InputLabel from '@/components/InputLabel.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import TextInput from '@/components/TextInput.vue';

import AppLayout from "@/Layouts/AppLayout.vue";
import {ref} from "vue";

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    mode: 'company',
});

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.password = password;
    form.password_confirmation = password;
};

const loginWithGoogle = () => {
    window.location.href = `/auth/google/redirect`;
}

const loginWithGithub = () => {
    window.location.href = `/auth/github/redirect`;
}

</script>

<template>
    
    <AppLayout>

        <div class="social-auth-block">
            <PrimaryButton type="button" class="ms-4 social-authorize" @click="loginWithGoogle">
                <span class="social-authorize-google"></span>Google авторизация
            </PrimaryButton>

            <PrimaryButton type="button" class="ms-4 social-authorize" @click="loginWithGithub">
                <span class="social-authorize-github"></span>GitHub авторизация
            </PrimaryButton>
        </div>


        <form id="register-form" class="form-guests" @submit.prevent="submit">
            <h1>Зарегистрироваться</h1>
            <div class="form-item-column mt-4">
                <h4>Выберите тип пользователя</h4>

                <div class="mt-2 form-item-bottom-column">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            name="mode"
                            value="candidate"
                            v-model="form.mode"
                            required
                            class="form-radio"
                        >
                        <span class="ml-2">Мастер</span>
                    </label>

                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            name="mode"
                            value="company"
                            v-model="form.mode"
                            required
                            class="form-radio"
                        >
                        <span class="ml-2">Заказчик</span>
                    </label>
                    <p>Вы сможете переключаться между режимами позже</p>
                </div>
            </div>
            <InputError class="form-error-message mt-2 text-error" :message="form.errors.mode" />

            <div class="mt-4">
                <InputLabel for="email" value="Email" />

                <TextInput
                    id="email"
                    type="email"
                    class="mt-1 block w-full"
                    v-model="form.email"
                    required
                    autocomplete="username"
                />

                <InputError class="mt-2 text-error" :message="form.errors.email" />
            </div>

            <span class="generate-password-link" @click="generatePassword">Сгенерировать пароль</span>



            <div class="mt-4 ">

                <InputLabel for="password" value="Пароль" />

                <div class="relative">
                    <TextInput
                        id="password"
                        :type="showPassword ? 'text' : 'password'"
                        class="mt-1 block w-full"
                        v-model="form.password"
                        required
                        autocomplete="new-password"
                    />

                <div :class="['toggle-visibility', showPassword ? 'password-hide' : 'password-show']"
                    @click="showPassword = !showPassword"
                    ></div>
                </div>

                <InputError class="mt-2 text-error" :message="form.errors.password" />
            </div>

            <div class="mt-4 ">
                <InputLabel
                    for="password_confirmation"
                    value="Подтвердить пароль"
                />

                <div class="relative">
                    <TextInput
                        id="password_confirmation"
                        :type="showPasswordConfirm ? 'text' : 'password'"
                        class="mt-1 block w-full"
                        v-model="form.password_confirmation"
                        required
                        autocomplete="new-password"
                    />
                    <div :class="['toggle-visibility', showPasswordConfirm ? 'password-hide' : 'password-show']"
                         @click="showPasswordConfirm = !showPasswordConfirm"
                    >
                    </div>
                </div>

                <InputError
                    class="mt-2 text-error"
                    :message="form.errors.password_confirmation"
                />
            </div>


            <div class="mt-4 flex items-center justify-end form-register-bottom">
                <Link
                    :href="route('login')"
                    class="rounded-md text-sm underline  focus:outline-none"
                >
                    Уже зарегистрированы?
                </Link>

                <PrimaryButton
                    class="ms-4"
                    :class="{ 'opacity-25': form.processing }"
                    :disabled="form.processing"
                >
                    Зарегистрироваться
                </PrimaryButton>
            </div>
        </form>
    </AppLayout>
</template>

<style scoped>
#register-form {

    color: #eeeeee;
    font-size: 18px;
    max-width: 490px;
    margin: 0 auto;
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
    }

    p {
        font-size: 14px;
        color: #a0adff;
    }
}

.form-register-bottom {
    flex-direction: column-reverse;
    font-size: 14px;
    justify-content: space-around;
}

@media screen and (min-width: 769px) {
    .form-register-bottom {
        flex-direction: row;
    }
}

.form-item-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 15px;

    h4 {
        margin-bottom: 15px;
        color: #ffffff;
    }
}

.form-item-bottom-column {
    display: flex;
    flex-direction: column;
    justify-content: center;

}

.generate-password-link {
    font-size: 14px;
    color: #a0adff;
    cursor: pointer;
    text-decoration: underline;
    margin-top: 5px;
    display: inline-block;
    text-align: right;
    width: 100%;
}

.generate-password-link:hover {
    color: #ffffff;
}


</style>
