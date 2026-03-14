<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import InputLabel from "@/components/InputLabel.vue";
import {useForm} from "@inertiajs/vue3";
import {route} from "ziggy-js";


const form = useForm({
    mode: '',
});

const setMode = () => {

    form.post(route('setMode'), {
        preserveScroll: true,
        preserveState: true,

        onSuccess: (page) => {
            console.log('Успешный ответ:')
            console.log(page)
        },

        onError: (errors) => {
            console.log('Ошибки:')
            console.log(errors)
        },

        onFinish: () => {
            console.log('Запрос завершён')
        }
    })
}

</script>

<template>
    <AppLayout>
        <form class="form-guests">

            <div class="form-item mt-4">
                <InputLabel value="Выберите тип пользователя" />

                <div class="mt-2">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            name="mode"
                            value="candidate"
                            v-model="form.mode"
                            @change="setMode"
                            class="form-radio"
                        >
                        <span class="ml-2">Мастер</span>
                    </label>

                    <label class="inline-flex items-center ml-6">
                        <input
                            type="radio"
                            name="mode"
                            value="company"
                            v-model="form.mode"
                            @change="setMode"
                            class="form-radio"
                        >
                        <span class="ml-2">Заказчик</span>
                    </label>
                </div>
            </div>

        </form>

    </AppLayout>
</template>

<style scoped>

</style>
