import {defineStore} from "pinia";

export const useFavoriteStore = defineStore('favoriteStore', {
    state: () => {
        return {
            favoriteCompanies: {},
            favoriteVacancies: {},
            favoriteCandidates: {},
            favoriteTasks: {},
        }
    },
    actions: {
        toggleFavoriteCompany(companyId) {

            const company = this.favoriteCompanies.find((company) => {
                return company.id === companyId
            });

            const old = company.isFavorite;
            company.isFavorite = !old;

            axios.post('/api/toggle-favorite-company', {
                companyId: companyId
            }, {
                headers: {
                    'Accept': 'application/json',
                }
            })
        },
        toggleFavoriteVacancy(vacancyId) {
            const vacancy = this.favoriteVacancies.find((vacancy) => {
                return vacancy.id === vacancyId
            });

            const old = vacancy.isFavorite;
            vacancy.isFavorite = !old;

            axios.post('/api/toggle-favorite-vacancy', {
                vacancyId: vacancyId
            }, {
                headers: {
                    'Accept': 'application/json',
                }
            })
        },
        toggleFavoriteCandidate(candidateId) {
            const candidate = this.favoriteCandidates.find((candidate) => {
                return candidate.id === candidateId
            });

            const old = candidate.isFavorite;
            candidate.isFavorite = !old;

            axios.post('/api/toggle-favorite-candidate', {
                candidateId: candidateId
            }, {
                headers: {
                    'Accept': 'application/json',
                }
            })
        },
        toggleFavoriteTask(taskId) {
            const task = this.favoriteTasks.find((task) => {
                return task.id === taskId
            });

            const old = task.isFavorite;
            task.isFavorite = !old;

            axios.post('/api/toggle-favorite-task', {
                taskId: taskId
            })
        },
    },
})
