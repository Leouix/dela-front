<script setup>
import UpdatePasswordForm from './Partials/UpdatePasswordForm.vue';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm.vue';
import AppLayout from "@/Layouts/AppLayout.vue";
import {Head} from "@inertiajs/vue3";

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});
</script>

<template>
    <Head title="Мой Профиль" />
    <AppLayout>
        <div class="py-12 edit-profile-page">
            <div class="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                <div
                    class="bg-dark p-4 shadow sm:rounded-lg sm:p-8"
                >
                    <UpdateProfileInformationForm
                        :must-verify-email="mustVerifyEmail"
                        :status="status"
                        class="max-w-xl"
                    />
                </div>

                <div
                    class="bg-dark p-4 shadow sm:rounded-lg sm:p-8"
                >

                    <UpdatePasswordForm class="max-w-xl"/>
                </div>


            </div>
        </div>
    </AppLayout>
</template>
