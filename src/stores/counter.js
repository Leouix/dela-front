import {defineStore} from "pinia";

export const useCounterStore = defineStore('counter', {
    state: ()=> {
       // console.log('state')
        return {
            count: 0,
            name: 'Lol',
            age: 101,
            object: {
                a: 1,
                b: 2
            },
            images: {
                url: '',
            }
        }
    },
    actions: {
        increment(val=1){
          //  console.log('actions increment')
            this.count += val;
        },
        waitAndAdd() {
           // console.log('actions waitAndAdd')
            setTimeout(()=>{
                this.count++;
            },2000);
        },
        // changeName(textInput) {
        //     // console.log({textInput})
        //     this.name = 'new Name | textInput'
        // }
    },
    getters: {
        doubleCount: (state) => {
        //    console.log('getters doubleCount')
            state.count * 2
        }
    }
})
