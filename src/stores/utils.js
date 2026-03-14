import {defineStore} from 'pinia'

export const useUtilsStore = defineStore('utilsStore', {
    state: () => ({
        userLocale: navigator.language || 'ru-RU',
    }),

    actions: {
        formatLocalTime(utcString) {
            const date = new Date(utcString);
            return date.toLocaleString(this.userLocale, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
        },
        formatLocalDate(utcString) {
            const date = new Date(utcString);
            return date.toLocaleString(this.userLocale, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            });
        },
        previewText(text, textLength = 350) {
            return text.length > textLength ? text.substring(0, textLength) + '...' : text;
        },
    }
})
