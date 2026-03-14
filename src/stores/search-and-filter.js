import {defineStore} from "pinia";

export const useSearchFilterStore = defineStore('searchFilterStore', {
    state: ()=> {
        return {
            items: [],
        }
    },
    actions: {
        formSubmit(e) {
            const dataForm = new FormData(e.target)
            const res = axios.post(
                '/api/search-filter',
                dataForm,
                {
                    headers: {
                        'Accept': 'application/json',
                    }
                })

            res.then(r=> {
                this.items = r.data
            })
        },
        formReset() {
            document.getElementById("filter-candidates").reset();
        },
    },
    getters: {
        countItems: (state) => {
            return state.items.length
        },
        getKeyId: () => {
            const d = new Date()
            return d.getTime()
        }
    }
})