<script setup>
import {useHeaderStore} from "@/stores/header.js";
import {usePage} from "@inertiajs/vue3";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import ToggleUserMode from "@/components/ToggleUserMode.vue";
import Auth from "@/components/Auth.vue";
import {useSupportStore} from "@/stores/support.js";

const supportStore = useSupportStore();

const headerStore = useHeaderStore();

const page = usePage();
const userRole = page.props.auth.user?.mode;
const modalRef = ref(null);

const supportMobileButtonRef = ref(null);


const adminMenu = computed(() => {
    return page.props.is_admin ? headerStore.menuConfig['admin'] : [];
});

const taskMenu = computed(() => {
    return userRole === 'candidate'
        ? headerStore.menuConfig['taskCandidate']
        : headerStore.menuConfig['taskCompany'];
})

const vacMenu = computed(() => {
    return userRole === 'candidate'
        ? headerStore.menuConfig['vacCandidate']
        : headerStore.menuConfig['vacCompany'];
})

const commonMenu = computed(() => {
    return userRole === 'candidate'
        ? headerStore.menuConfig['common']
        : headerStore.menuConfig['common'];
})

const favoritesMenu = computed(() => {
    return userRole === 'candidate'
        ? headerStore.menuConfig['candidateFavorites']
        : headerStore.menuConfig['companyFavorites'];
})

function toggleShow() {
    // props.closeMenu();
    supportStore.toggleShowModal()
}

const handleClickOutside = (e) => {

    if (modalRef.value
        && !modalRef.value.contains(e.target)
        && !supportMobileButtonRef.value?.contains(e.target)) {

        supportStore.showModal = false;
    }
};

onMounted(() => {
    document.addEventListener('click', (e) => {
        handleClickOutside(e)
    })
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

window.onVerify = token => (supportStore.form.recaptchaToken = token);

const makeId = () =>
    'recaptcha-' + Math.random().toString(36).slice(2, 9);

const renderRecaptcha = id => {
    const el = document.getElementById(id);
    if (el && window.grecaptcha) {
        window.grecaptcha.render(id, {
            sitekey : page.props.recaptcha_site_key,
            callback: onVerify,          // передаём саму функцию
            theme   : 'light',
            size    : 'normal',
        });
    }
};

const recaptchaId = ref('');      // всегда свежий id

watch(
    () => supportStore.showModal,
    async opened => {
        if (!opened) return;          // закрылась — ничего не делаем

        recaptchaId.value = makeId(); // новый контейнер → новый id
        await nextTick();             // ждём появления div в DOM

        // если скрипт reCAPTCHA ещё не успел загрузиться
        if (!window.grecaptcha) {
            const timer = setInterval(() => {
                if (window.grecaptcha) {
                    clearInterval(timer);
                    renderRecaptcha(recaptchaId.value);
                }
            }, 50);
        } else {
            renderRecaptcha(recaptchaId.value);
        }
    },
    { immediate: false }
);


/**
 * Тексты и урлы кнопок
 * @type {ComputedRef<string>}
 */

const textTaskButton = computed(() => {
    return userRole === 'candidate'
        ? 'Закрыть задачу'
        : 'Создать задачу';
})
const urlTaskButton = computed(() => {
    return userRole === 'candidate'
        ? '/task-orders'
        : '/my/company/new-task';
})

const textVacButton = computed(() => {
    return userRole === 'candidate'
        ? 'Найти вакансию'
        : 'Создать вакансию';
})
const urtVacButton = computed(() => {
    return userRole === 'candidate'
        ? '/all-vacancies'
        : '/my/company/new-vacancy';
})

</script>

<template>
  <div id="mobile-menu">
    <img
        src="/images/icons/close.svg"
        alt="close"
        id="close-menu-button"
        @click="headerStore.closeMenu"
    >

      <div>

          <div class="task-menu-area">
              <a class="add-new-button" :href="urlTaskButton">
                  <div class="new-task-button">
                      <div class="new-task-button__plus">+</div>
                      <div class="new-task-button__text">{{textTaskButton}}</div>
                  </div>
              </a>

              <ul  v-if="taskMenu" class="public-menu">
                  <li v-for="menuItem in taskMenu" :key="'a-menuItem-'+menuItem.id" class="menu-items-li">
                      <a
                          v-bind:href="menuItem.href"
                      >
                          <span v-if="headerStore.showDesktopSidebar">{{ menuItem.text }}</span>
                      </a>
                  </li>
              </ul>
          </div>


          <div class="task-menu-area">
              <a class="add-new-button" :href="urtVacButton">
                  <div class="new-vacancy-button">
                      <div class="new-vacancy-button__plus">+</div>
                      <div class="new-vacancy-button__text">{{textVacButton}}</div>
                  </div>
              </a>

          <ul>
              <li  v-for="menuItem in vacMenu"
                   :key="'menuItem' + headerStore.getKeyId"
              >
                  <a v-bind:href="menuItem.href">
                      {{ menuItem.title }}
                  </a>
              </li>
            </ul>
          </div>

          <ul class="public-menu-mobile">
              <li  v-for="menuItem in commonMenu"
                   :key="'menuItem' + headerStore.getKeyId"
              >
                  <a v-bind:href="menuItem.href" >
                      {{ menuItem.title }}
                  </a>
              </li>
          </ul>

          <ul class="public-menu-mobile favorite-menu-mobile">
              <li  v-for="menuItem in favoritesMenu"
                   :key="'menuItem' + headerStore.getKeyId"
              >
                <a v-bind:href="menuItem.href" >
                  {{ menuItem.title }}
                </a>
              </li>
          </ul>

          <ul class="public-menu-mobile admin-menu-mobile">
              <li v-for="menuItem in adminMenu"
                  :key="'menuItem' + headerStore.getKeyId"
              >
                <a v-bind:href="menuItem.href" >
                    {{ menuItem.title }}
                </a>
              </li>
          </ul>
      </div>


      <auth />

      <div id="support-flag-mobile" class="dashboard-top-item dashboard-top-item-support" ref="supportMobileButtonRef">
          <div id="support-button-mobile" class="block" @click="toggleShow">
              <div class="icon-support"></div>
              <div class="text">Support</div>
          </div>
      </div>

      <Transition >
          <div v-if="supportStore.showModal" class="modal-mask" >
              <div id="support-modal" class="modal-container" ref="modalRef">

                  <div class="support-modal-close" @click="supportStore.showModal = false"></div>

                  <div class="modal-header">
                      <h2 class="text-lg font-medium text-gray-900">Напишите в поддержку:</h2>
                  </div>

                  <div class="modal-body">
                      <form id="support-form" @submit.prevent="supportStore.submitForm">
                          <textarea name="text_message" class="support-textarea" rows="7"></textarea>
                          <input
                              name="email_message"
                              type="text"
                              placeholder="Ваш емейл (необязательно)"
                          />

                          <div :id="recaptchaId" class="g-recaptcha"></div>

                          <input type="submit" value="Отправить" />
                      </form>
                  </div>

                  <div class="modal-footer">
                  </div>
              </div>
          </div>
      </Transition>

  </div>
</template>
<style scoped>



</style>
