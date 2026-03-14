import {defineStore} from "pinia";

export const useProductStore = defineStore('productStore', {
    state: ()=> {
        return {
            stockAvailable: true,
            stockCount: null,
            item: {
                images: [],
            },
            attributes: [],
        }
    },
    actions: {
        addImage(image) {

           this.item.images.push(image)
        }
    },
    getters: {
        // doubleCount: (state) => {
        //     console.log('getters doubleCount')
        //     state.count * 2
        // }
    }
})