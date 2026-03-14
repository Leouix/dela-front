<script setup>
import {Link, useForm} from '@inertiajs/vue3';
import { getUsePage } from "@/composables/usePage.js";

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const page = getUsePage();
const user = page.props.auth.user;

const form = useForm({
    name: user.name,
    email: user.email,
});
</script>

<template>
    <section>
        <header>
            <h2 class="text-lg font-medium text-white-900">
                Информация об аккаунте
            </h2>
        </header>

        <form
            @submit.prevent="form.patch(route('profile.update'))"
            class="mt-6 space-y-6"
        >

            <div v-if="mustVerifyEmail && user.email_verified_at === null">
                <p class="mt-2 text-sm text-white-800">
                    Ваш email не верифицирован.
                    <Link
                        :href="route('verification.send')"
                        method="post"
                        as="button"
                        class="rounded-md text-sm text-white-600 underline hover:text-white-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Нажмите чтобы отправить новое письмо верификации аккаунта
                    </Link>
                </p>

                <div
                    v-show="status === 'verification-link-sent'"
                    class="mt-2 text-sm font-medium text-green-600"
                >
                    Новая ссылка верификации отправлена Вам на почту.
                </div>
            </div>


        </form>
    </section>
</template>
