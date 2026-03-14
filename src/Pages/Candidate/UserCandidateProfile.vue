<script setup>
import {useCandidateStore} from "@/stores/candidate.js";
import AppLayout from "@/Layouts/AppLayout.vue";
import {onMounted, ref} from "vue";
import {Head, Link} from "@inertiajs/vue3";
import ResponsiveNavLink from "@/components/ResponsiveNavLink.vue";
import CandidateForm from "@/Pages/Candidate/CandidateForm.vue";

const store = useCandidateStore();

const props = defineProps([
    'candidate',
    'notes',
    'specialistStatistic',
]);

store.candidate = props.candidate;
store.notes = props.notes;

store.candidate.form_job = props.candidate.form_job ?? '';
store.candidate.gender = props.candidate.gender ?? '';

const aboutTextarea = ref(null);

onMounted(() => {
    if (aboutTextarea.value) {
        aboutTextarea.value.style.height = 'auto'
        aboutTextarea.value.style.height = aboutTextarea.value.scrollHeight + 'px'
    }
});


</script>

<template>

    <Head title="Мой профиль" />

    <AppLayout>

            <div class="page content candidate-page">

                <div class="profile-preview-area">
                    <a :href="'/overview/specialist/' + store.candidate.slug">{{store.candidate.name}}</a>
                </div>
                <div class="candidate-card">

                  <CandidateForm :candidate="store.candidate" />

                    <div class="customer-statistic-area">
                        <h4>Статистика:</h4>
                        <div class="customer-statistic">
                            <div v-for="(value, name, index) in specialistStatistic.data" :key="index" :class="value.class">
                                <div>{{ name }}: </div><div>{{ value.value }}</div>
                            </div>
                        </div>
                    </div>

                </div>

                <hr>

                <div class="manage-profile-area">
                    <ResponsiveNavLink :href="route('profile.edit')" class="account-edit-link">Управление аккаунтом
                    </ResponsiveNavLink>

                    <Link
                        :href="route('logout')"
                        method="post"
                        as="button"
                    >
                        Выйти
                    </Link>
                </div>


            </div>

    </AppLayout>


</template>

<style scoped>


</style>
