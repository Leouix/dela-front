import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

export const useEditCompanyProfileStore = defineStore('editCompanyProfileStore', {
    state: () => {
        return {
            company: {
                avatar: {},
            },
            previewImage: null
        }
    },
    actions: {
        edit(e) {
            const form = e.target;
            const formData = new FormData(form);
            if (formData.entries().next().done) {
                return;
            }
            const data = new FormData(e.target)
            axios.post('/api/my/company/edit-company-profile', data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((response) => {
                    if (response.status === 200) {

                        const noticeStore = useNoticeSuccessStore()
                        noticeStore.run()
                    }
                })
                .catch((error)=>  {
                    if (error?.response?.data?.message) {
                        this.noticeError(error?.response?.data?.message)
                    }
                });
        },
        onChangeImage(e) {
            const file = e.target.files[0];
            if (!file) return;

            // Проверка типа файла
            if (!file.type.match('image.*')) {
                alert('Пожалуйста, выберите изображение');
                e.target.value = ''; // Очистить input
                return;
            }

            // Создаем превью изображения
            const reader = new FileReader();
            reader.onload = (e) => {
                if (!this.company.image) {
                    this.company.image = {};
                }

                this.company.image.url = e.target.result;

            };
            reader.readAsDataURL(file);

            axios.post('/api/my/company/set-image-company', {
                image: file,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((response) => {
                 //   console.log({response})
                    if (response.status === 200) {

                    }
                })
        },
        setPostItemId(id) {
            this.company.id = id;
        },
        deleteImage() {
            axios.post('/api/my/company/delete-image-company', {}, {
                headers: {
                    'Accept': 'application/json',
                }
            }).then((response) => {
                if (response.status === 200) {
                    this.company.image.url = null
                }
            })
        },
        noticeError(text) {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.run(text)
        },
    },
    getters: {

    }
})
