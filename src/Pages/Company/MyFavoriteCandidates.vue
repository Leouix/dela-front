<script setup>
import { ref, onMounted } from 'vue'
import {useFavoriteStore} from "@/stores/favorites.js";
import AppLayout from "@/Layouts/AppLayout.vue";


const favoriteCandidates = ref({ data: [] })

const store = useFavoriteStore();

async function fetchData() {
    // TODO: axios.get('/api/...')
    // favoriteCandidates.value = response.data
}

onMounted(() => {
    fetchData()
    store.favoriteCandidates = favoriteCandidates.value.data.map((candidate) => {
        candidate.isFavorite = true;
        return candidate;
    });
})

</script>

<template>

    
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
