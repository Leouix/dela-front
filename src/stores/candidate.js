import {defineStore} from "pinia";
import {useNoticeSuccessStore} from "@/stores/notice-success.js";
import {useNoticeErrorStore} from "@/stores/notice-error.js";

export const useCandidateStore = defineStore('candidateStore', {
    state: ()=> {
        return {
            candidate: {
                languages: [],
            },
            isFavorite: null,
            isFavoriteCompany: null,
            isFavoriteVacancy: null,
            notes: [],
            textEditableIds: [],
            datetimeEditables: [],
            tags: [],
            saveError: '',
            isLockedInfo: true,
            isUploadAvatarDisabled: true,
            domain: '',
            shareLink: '',
            categories: [],
            selectedCategories: null,
            languages: [],
            languageLevels: [],
        }
    },
    actions: {
        toggleFavorite() {
            this.isFavorite = !this.isFavorite
            axios.post('/api/toggle-favorite', {
                candidateId: this.candidate?.id
            }, {
                headers: {
                    'Accept': 'application/json',
                }
            })
        },
        toggleLockCandidate() {
            this.isLockedInfo = !this.isLockedInfo
        },
        createNote(e) {
            const formData = new FormData(e.target);
            if (formData.entries().next().done) {
                return;
            }

            axios.post('/api/candy-notes', formData, {
                headers: {
                    'Accept': 'application/json',
                }
            })
            .then((response) => {
                if (response.status === 201) {

                    this.notes.unshift(response.data)
                    e.target.reset()
                }
            })
            .catch((error) =>  {
                console.log(error)
                this.noticeError(error.response.data?.message ?? error.response.data)
            });
        },
        async editTextNote(noteId) {

            this.textEditableIds[noteId] = !this.textEditableIds[noteId];
            const noteItemText = document.getElementById('note-item-text-' + noteId)
            this.focusOnElement(noteItemText)

            if (this.textEditableIds[noteId] === false) {
                const text = noteItemText.innerText
                await this.saveTextNote(noteId, text)
                noteItemText.classList.add('fire')
                setTimeout(() => {
                    noteItemText.classList.remove('fire')
                }, 250)
            }
        },
        setEndOfContenteditable(elem) {
            let sel = window.getSelection();
            sel.selectAllChildren(elem);
            sel.collapseToEnd();
        },
        focusOnElement(el) {
            setTimeout(() => el.focus(), 0)
            this.setEndOfContenteditable(el)
        },
        saveTextNote(noteId, text) {
            const data = {
                noteId: noteId,
                text: text
            }
            axios.post('/api/edit-note-text', data, {
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then(function (response) {
                })
                .catch((error) =>  {
                    console.log(error)
                });
        },
        async editDatetime(noteId) {
            this.datetimeEditables[noteId] = !this.datetimeEditables[noteId];

            const noteItemDt = document.getElementById('note-item-dt-' + noteId)
            this.focusOnElement(noteItemDt)
            if (this.datetimeEditables[noteId] === false) {
                const dt = noteItemDt.innerText
                await this.saveNoteDatetime(noteId, dt)
                noteItemDt.classList.add('fire')
                setTimeout(()=> {
                    noteItemDt.classList.remove('fire')
                }, 250)

            }
        },
        saveNoteDatetime(noteId, dt) {
            const data = {
                noteId: noteId,
                custom_date: dt
            }
            axios.post('/api/edit-note-dt', data, {
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then(function (response) {

                })
                .catch((error) =>  {
                    console.log(error)
                    this.noticeError(error.response.data?.message ?? error.response.data)
                });
        },
        handleChangeTag(tags) {
            this.tags = tags;
            console.log(this.tags)
        },
        removeNote(noteId) {
            const data = {
                noteId: noteId,
            }
            axios.post('/api/remove-note', data, {
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then( (response) => {
                    if (response.status === 200) {
                        delete this.notes.find(note => note.id === noteId)
                        this.notes = this.notes.filter(item => item.id !== noteId);
                    }
                })
                .catch((error) =>  {
                    console.log(error)
                });
        },
        uploadImage(e, candidateId) {
            if ( e?.target?.files && e?.target?.files?.length > 0) {
                const image = e.target.files[0];
                let data = new FormData();
                data.append('image', image);
                data.append('candidateId', candidateId);
                axios.post('/api/images/upload-avatar', data)
                    .then((response) => {
                        if (response.status === 200) {
                            this.setAvatarData(response.data)
                        }
                    })
                    .catch((error) =>  {
                        console.log('catch error:', error)
                        this.noticeError(error.response.data?.message ?? error.response.data)
                    });
            }
        },
        setAvatarData(url) {
            if (!this.candidate?.avatar) {
                this.candidate.avatar = {}
            }
            this.candidate.avatar.url = url
        },

        saveCandidate(e) {

            const dataForm = new FormData(e.target);

            dataForm.set('add_catalog', this.candidate.add_catalog ? 1 : 0)

            if (this.candidate.languages) {
                for (const [key, value] of Object.entries(this.candidate)) {
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
                }
            }

            if (this.selectedCategories?.length) {
                this.selectedCategories.forEach(cat => {
                    dataForm.append('categories[]', cat.id)
                })
            }

            axios.post('/api/save-candidate', dataForm)
                .then((response) => {
                    if (response.status === 200) {
                        this.saveError = ''
                        this.isLockedInfo = true

                        const noticeStore = useNoticeSuccessStore()
                        noticeStore.run()
                    }
                })
                .catch((error) => {
                    console.log('catch error:', error)
                    this.noticeError(error.response.data?.message ?? error.response.data)
                    if (error?.response?.data) {
                        this.saveError = error.response.data.message
                    }
                });
        },
        onchangeAvatar(e) {
            var file = e.target.files[0]
            let fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload =  ()=>{
                this.setTempAvatar(fileReader.result)
            }
        },
        setTempAvatar(data) {
            if (!this.candidate?.avatar?.url) {
                this.candidate.avatar = {}
            }
            this.candidate.avatar.url = data
        },
        makeShareCandidate() {
            axios.post('/api/share/profile', {})
                .then((response) => {
                    if (response.status === 201) {
                        console.log(response?.data)
                    }
                });
        },
        toggleFavoriteCompany(companyId) {
            this.isFavoriteCompany = !this.isFavoriteCompany
            axios.post('/api/toggle-favorite-company', {
                companyId: companyId
            }, {
                headers: {
                    'Accept': 'application/json',
                }
            })
        },
        toggleFavoriteVacancy(vacancyId) {
            this.isFavoriteVacancy = !this.isFavoriteVacancy
            axios.post('/api/toggle-favorite-vacancy', {
                vacancyId: vacancyId
            }, {
                headers: {
                    'Accept': 'application/json',
                }
            })
        },
        deleteImage() {
            axios.post('/api/delete-image', {}, {
                headers: {
                    'Accept': 'application/json',
                }
            }).then((response) => {
                if (response) {
                    this.setAvatarData('/images/default-ava-5.png')
                }
            })
        },
        noticeError(text) {

            //console.log('notice error ')
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
    },
    getters: {
        getAvatarUrl: (state) => {
            return state?.candidate?.avatar?.url ? state?.candidate?.avatar?.url : '/images/default-ava-5.png'
        },
        getAvatarName: (state) => {
            let avatarName;
            if (state?.candidate?.avatar?.orig_name && state?.candidate?.avatar?.orig_name !== '') {
                avatarName = state?.candidate?.avatar?.orig_name
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
