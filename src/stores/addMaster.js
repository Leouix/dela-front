import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";
import {useNoticeErrorStore} from "@/stores/notice-error.js";
import axios from "axios";

export const useAddCandidateStore = defineStore('addCandidateStore', {
    state: ()=> {
        return {
            candidateDto: {
                name: '',
                profession: '',
                experience: '',
                age: '',
                gender: '',
                location: '',
                form_job: '',
                citizenship: '',
                salary: '',
                about: '',
                newEmail: '',
                languages: [],
            },
            avatar: null,
            avatarPreview: '/images/default-ava-5.png',
            tags: [],
            saveError: '',
            categories: [],
            selectedCategories: null,
            formLoading: false,
            languages: [],
            languageLevels: [],
        }
    },
    actions: {
        handleChangeTag(tags) {
            this.tags = tags;
        },
        uploadImage(e) {
            if (e?.target?.files?.length) {
                const file = e.target.files[0];

                this.avatar = file; // сохраняем файл

                const reader = new FileReader();
                reader.onload = () => {
                    this.avatarPreview = reader.result; // только для превью
                };
                reader.readAsDataURL(file);
            }
        },

        addNewMaster(e) {

            this.formLoading = true;

            const dataForm = new FormData()

            if (this.candidateDto) {
                for (const [key, value] of Object.entries(this.candidateDto)) {
                    // Если это массив языков, обрабатываем его отдельно
                    if (key === 'languages' && Array.isArray(value)) {
                        value.forEach((lang, index) => {
                            // Отправляем только если выбран И язык И уровень
                            if (lang.language && lang.level) {
                                dataForm.append(`languages[${index}][language]`, lang.language);
                                dataForm.append(`languages[${index}][level]`, lang.level);
                            }
                        });
                    }
                    // Обработка остальных полей (кроме null)
                    else if (value !== null) {
                        dataForm.append(key, value);
                    }
                }
            }

            if (this.avatar) {
                dataForm.append('avatar', this.avatar)
            }

            if (this.selectedCategories?.length) {
                this.selectedCategories.forEach(cat => {
                    dataForm.append('categories[]', cat.id)
                })
            }

            axios.post('/api/add-master-to-catalog', dataForm)
                .then((response) => {
                    if (response.status === 200) {
                        this.saveError = ''

                        this.resetForm();
                        const noticeStore = useNoticeSuccessStore()
                        noticeStore.run()
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(()=> {
                    setTimeout(()=> {
                        this.formLoading = false;
                    }, 1500)
                });
        },

        deleteImage() {
            this.avatar = null;
            this.avatarPreview = '/images/default-ava-5.png'
        },
        noticeError(text) {
            const noticeErrorStore = useNoticeErrorStore()
            noticeErrorStore.run(text)
        },
        getCategories() {
            axios.post('/api/get-categories')
                .then((response) => {
                    if (response.status === 200) {
                        this.categories = response.data
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getLanguages() {
            axios.post('/api/get-languages')
                .then((response) => {
                    if (response.status === 200) {
                        this.languages = response.data.languages
                        this.languageLevels = response.data.levels
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        groupCategories(data) {

            console.log({data})
            return data.map(category => ({
                id: category.id,
                slug: category.slug,
                items: data
                    .filter(item => item.id === category.id)
                    .map(item => ({
                        id: item.id,
                        name: item.name,
                        slug: item.slug
                    }))
            }))
        },
        resetForm() {
            this.candidateDto = {
                name: '',
                profession: '',
                experience: '',
                age: '',
                gender: '',
                location: '',
                form_job: '',
                citizenship: '',
                salary: '',
                about: '',
                newEmail: '',
                languages: [],
            }
            this.avatar = null;
            this.saveError = '';
            this.selectedCategories = null;
            this.formLoading = false;
        },
    },
    getters: {
        getAvatarUrl: (state) => {
            return state.avatarPreview || '/images/default-ava-5.png'
        },
        getAvatarName: (state) => {
            let avatarName;
            if (state?.avatar?.orig_name && state?.avatar?.orig_name !== '') {
                avatarName = state?.avatar?.orig_name
            } else {
                let url = this.getAvatarUrl
                avatarName = url.substring(url.lastIndexOf('/') + 1);
            }
            return avatarName
        },
        getIsCandidateEdited: (state) => {
            return state?.candidateEdited?.length > 0;
        }
    }
})
