<script setup>
import { Head } from '@inertiajs/vue3'
import AppLayout from "@/Layouts/AppLayout.vue";
import CandidateAddCatalogForm from "@/Pages/Candidate/CandidateAddCatalogForm.vue";

</script>

<template>
    <Head title="Добавить резюме в каталог" />
    <AppLayout>
        <div class="page content candidate-page">
            <h1>Добавить резюме в каталог</h1>

            <div class="candidate-card">
                <CandidateAddCatalogForm :candidate="null" />

            </div>
        </div>

    </AppLayout>
</template>
