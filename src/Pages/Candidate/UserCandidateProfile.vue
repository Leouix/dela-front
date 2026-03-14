<script setup>
import {useCandidateStore} from "@/stores/candidate.js";
import AppLayout from "@/Layouts/AppLayout.vue";
import {onMounted, ref} from "vue";

import ResponsiveNavLink from "@/components/ResponsiveNavLink.vue";
import CandidateForm from "@/Pages/Candidate/CandidateForm.vue";

import axios from "axios";

const store = useCandidateStore();

const candidate = ref(null)
const notes = ref(null)
const specialistStatistic = ref({ data: {} })

async function fetchData() {
    const response = await axios.post('/api/my/specialist/profile')
    candidate.value = response.data.candidate
}

onMounted(() => {
    fetchData()
    if (aboutTextarea.value) {
        aboutTextarea.value.style.height = 'auto'
        aboutTextarea.value.style.height = aboutTextarea.value.scrollHeight + 'px'
    }
})

store.candidate = candidate.value ?? {};
store.notes = notes.value ?? [];

store.candidate.form_job = candidate.value?.form_job ?? '';
store.candidate.gender = candidate.value?.gender ?? '';

const aboutTextarea = ref(null);


</script>

<template>

    

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
