<script setup>

import {onMounted} from "vue";
import {useFavoriteStore} from "@/stores/favorites.js";
import AppLayout from "@/Layouts/AppLayout.vue";
import {Head} from "@inertiajs/vue3";

const props = defineProps({
    favoriteCandidates: Object,
})

const store = useFavoriteStore();

onMounted(() => {
    store.favoriteCandidates = props.favoriteCandidates.data.map((candidate) => {
        candidate.isFavorite = true;
        return candidate;
    });
})

</script>

<template>

    <Head title="Избранные специалисты" />
    <AppLayout>

        <h1>Избранные мастера</h1>

        <div v-for="candidate in store.favoriteCandidates" class="favorite-candidates">

           <div>
               <div
                   @click="store.toggleFavoriteCandidate(candidate.id)"
                   v-bind:class="
                candidate?.isFavorite
                    ? 'star-icon favorite'
                    : 'star-icon'
            "
               ></div>

               <div><a :href="'/overview/specialist/' + candidate.slug">{{candidate.name}}</a></div>
           </div>
        </div>

    </AppLayout>

</template>

<style scoped>
.favorite-candidates div {
    display: flex;
    flex-direction: row-reverse;
    gap: 10px;
    align-items: center;
    justify-content: start;
}
</style>
