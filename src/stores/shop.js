import {defineStore} from "pinia";

export const useShopStore = defineStore('shopStore', {
    state: ()=> {
        return {
            userToken: null,
            products: [],
            cartItems: [],
        }
    },
    actions: {
        addToCart(e) {
            const itemId = e.target.getAttribute('data-id')
            this.cartItems.push(this.products[itemId])
            this.addToDb(itemId)
        },

        addToDb(itemId) {

            const data = {
                token: this.userToken,
                item: itemId
            }

            // console.log('data', data)

            axios.post('/api/add-to-cart', data, {
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then(function (response) {
                 //   console.log(response)
                    if (response.status === 200) {
                        console.log('200')
                    }
                })
                .catch(function (error) {
                    console.log(error)
                });
        },


    },
    getters: {
        // doubleCount: (state) => {
        //     console.log('getters doubleCount')
        //     state.count * 2
        // }
    }
})
