import {defineStore} from "pinia";

export const useHeaderStore = defineStore('useHeaderStore', {
    state: () => {
        const savedSidebar = localStorage.getItem('sidebarState');
        let defaultSidebarState = {
            showDesktopSidebar: true,
            widthSideBar: 250,
        };

        if (savedSidebar) {
            try {
                const parsed = JSON.parse(savedSidebar);
                defaultSidebarState = {
                    ...defaultSidebarState,
                    ...parsed,
                };
            } catch (e) {
                console.warn('Ошибка при чтении sidebarState из localStorage:', e);
            }
        }

        return {
            showMobileMenu: false,
            showDesktopSidebar: defaultSidebarState.showDesktopSidebar,
            widthSideBar: defaultSidebarState.widthSideBar,
            menuConfig: {
                taskCandidate: [
                    {
                        href: "/task-orders",
                        icon: "/images/icons/fast-response.svg",
                        title: "Мои задачи",
                        text: "Мои задачи",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    // {
                    //     href: "/my/specialist/my-task-responses",
                    //     icon: "/images/icons/list.svg",
                    //     title: "Мои отклики",
                    //     text: "Мои отклики",
                    //     alt: "megaphone icon",
                    //     iconClass: "megaphone-svg"
                    // },
                    {
                        href: "/all-tasks",
                        icon: "/images/icons/list.svg",
                        title: "Все задачи",
                        text: "Все задачи",
                        alt: "list icon",
                        iconClass: "list-svg"
                    },
                ],
                vacCandidate: [
                    {
                        href: "/my/specialist/my-job-responses",
                        icon: "/images/icons/fast-response.svg",
                        title: "Мои вакансии",
                        text: "Мои отклики на вакансии",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/all-vacancies",
                        icon: "/images/icons/list.svg",
                        title: "Все вакансии",
                        text: "Все вакансии",
                        alt: "list icon",
                        iconClass: "list-svg"
                    },
                ],
                taskCompany: [
                    {
                        href: "/my/company/my-tasks",
                        icon: "/images/icons/fast-response.svg",
                        title: "Мои задачи",
                        text: "Мои задачи",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/task-orders",
                        icon: "/images/icons/list.svg",
                        title: "Задачи в работе",
                        text: "Задачи в работе",
                        alt: "megaphone icon",
                        iconClass: "megaphone-svg"
                    },
                    {
                        href: "/all-tasks",
                        icon: "/images/icons/list.svg",
                        title: "Все задачи",
                        text: "Все задачи",
                        alt: "list icon",
                        iconClass: "list-svg"
                    },
                ],
                vacCompany: [
                    {
                        href: "/my/company/my-vacancies",
                        icon: "/images/icons/fast-response.svg",
                        title: "Мои вакансии",
                        text: "Мои вакансии",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/all-vacancies",
                        icon: "/images/icons/list.svg",
                        title: "Все вакансии",
                        text: "Все вакансии",
                        alt: "list icon",
                        iconClass: "list-svg"
                    },
                ],
                common: [
                    {
                        href: "/about",
                        icon: "/images/icons/fast-response.svg",
                        title: "О сервисе",
                        text: "О сервисе",
                        alt: "about icon",
                        iconClass: "about-svg public"
                    },
                    {
                        href: "/add-catalog",
                        icon: "/images/icons/fast-response.svg",
                        title: "Добавить резюме в каталог",
                        text: "Добавить резюме в каталог",
                        alt: "catalog icon",
                        iconClass: "about-svg public"
                    }
                ],
                candidate: [
                    {
                        href: "/my/specialist/my-task-responses",
                        icon: "/images/icons/fast-response.svg",
                        title: "Мои отклики",
                        text: "Мои отклики - задачи",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/my/specialist/my-job-responses",
                        icon: "/images/icons/fast-response.svg",
                        title: "Мои отклики",
                        text: "Мои отклики - вакансии",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/my/specialist/favorite-tasks",
                        icon: "/images/icons/favorite-vacancies.svg",
                        title: "Избранные задачи",
                        text: "Избранные задачи",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/my/specialist/favorite-vacancies",
                        icon: "/images/icons/favorite-vacancies.svg",
                        title: "Избранные вакансии",
                        text: "Избранные вакансии",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/my/specialist/favorite-companies",
                        icon: "/images/icons/favorite-companies.svg",
                        title: "Избранные компании",
                        text: "Избранные компании",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/task-orders",
                        icon: "/images/icons/list.svg",
                        title: "Задачи в работе",
                        text: "Задачи в работе",
                        alt: "megaphone icon",
                        iconClass: "megaphone-svg"
                    },
                ],
                company: [
                    {
                        href: "/my/company/my-tasks",
                        icon: "/images/icons/data-collection.svg",
                        title: "Мои задачи",
                        text: "Мои задачи",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/my/company/my-vacancies",
                        icon: "/images/icons/data-collection.svg",
                        title: "Мои вакансии",
                        text: "Мои вакансии",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/task-orders",
                        icon: "/images/icons/list.svg",
                        title: "Задачи в работе",
                        text: "Задачи в работе",
                        alt: "megaphone icon",
                        iconClass: "megaphone-svg"
                    },
                    {
                        href: "/my/company/favorite-candidates",
                        icon: "/images/icons/heart.svg",
                        title: "Избранные мастера",
                        text: "Избранные мастера",
                        alt: "megaphone icon",
                        iconClass: "megaphone-svg"
                    },
                ],
                auth: [


                ],
                guest: [
                    {
                        href: "/my/specialist/profile",
                        icon: "/images/icons/user.svg",
                        title: "Мой профиль",
                        text: "Мой профиль",
                        alt: "user icon",
                        iconClass: "user-svg"
                    },
                    {
                        href: "/my/specialist/my-task-responses",
                        icon: "/images/icons/fast-response.svg",
                        title: "Мои отклики",
                        text: "Мои отклики",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/my/company/my-vacancies",
                        icon: "/images/icons/data-collection.svg",
                        title: "Мои вакансии",
                        text: "Мои вакансии",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/my/company/new-vacancy",
                        icon: "/images/icons/document.svg",
                        title: "Создать вакансию",
                        text: "Создать вакансию",
                        alt: "document icon",
                        iconClass: "document-svg"
                    },
                    {
                        href: "/login",
                        icon: "/images/icons/heart.svg",
                        title: "Избранное",
                        text: "Избранное",
                        alt: "favorites icon",
                        iconClass: "megaphone-svg"
                    },
                ],
                admin: [
                    {
                        href: "/administrator-page",
                        icon: "/images/icons/document.svg",
                        title: "Админ",
                        text: "Админ",
                        alt: "partner vacancy icon",
                        iconClass: "partner-vacancy-svg"
                    },
                    {
                        href: "/add-catalog",
                        icon: "/images/icons/fast-response.svg",
                        title: "Добавить резюме в каталог",
                        text: "Добавить резюме в каталог",
                        alt: "catalog icon",
                        iconClass: "about-svg public"
                    }
                ],
                candidateFavorites: [
                    {
                        href: "/my/specialist/favorite-tasks",
                        icon: "/images/icons/favorite-vacancies.svg",
                        title: "Избранные задачи",
                        text: "Избранные задачи",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/my/specialist/favorite-vacancies",
                        icon: "/images/icons/favorite-vacancies.svg",
                        title: "Избранные вакансии",
                        text: "Избранные вакансии",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                    {
                        href: "/my/specialist/favorite-companies",
                        icon: "/images/icons/favorite-companies.svg",
                        title: "Избранные компании",
                        text: "Избранные компании",
                        alt: "data-collection icon",
                        iconClass: "data-collection-svg"
                    },
                ],
                companyFavorites: [
                    {
                        href: "/my/company/favorite-candidates",
                        icon: "/images/icons/heart.svg",
                        title: "Избранные мастера",
                        text: "Избранные мастера",
                        alt: "megaphone icon",
                        iconClass: "megaphone-svg"
                    },
                ],
            }
        };
    },
    actions: {
        toggleMobileMenu () {
            this.showMobileMenu = !this.showMobileMenu;
        },
        async toggleDesktopMenu() {
            if (this.widthSideBar === 30) {
                this.openMenuArea()
                setTimeout(()=> {
                    this.showDesktopSidebar = true
                    this.saveSidebarState();
                }, 220)
            } else {
                this.hideMenuArea()
                this.showDesktopSidebar = false
                this.saveSidebarState();
            }
        },
        hideMenuArea() {
            this.widthSideBar = this.widthSideBar = 30
        },
        openMenuArea() {
            this.widthSideBar = this.widthSideBar = 250
        },
        saveSidebarState() {
            localStorage.setItem('sidebarState', JSON.stringify({
                showDesktopSidebar: this.showDesktopSidebar,
                widthSideBar: this.widthSideBar,
            }));
        },
        openMenuItems() {
            const menuItems = document.querySelector('.sidebar ul')
            menuItems.classList.remove('minimized-menu')
        },
        closeMenu() {
            this.showMobileMenu = false
        }
    },
    getters: {
        getKeyId: (state) => {
            const d = new Date()
            return d.getTime()
        }
    }
})
