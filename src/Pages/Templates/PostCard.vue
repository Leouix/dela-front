<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
    title: { type: String, required: true },
    text: { type: String, default: null },
    cost: { type: [Number, String], default: null },
    note: { type: String, default: null },

    createdAt: { type: String, default: null },
    deadline: { type: String, default: null },

    href: { type: String, required: true },
    useRouter: { type: Boolean, default: false },

    footerSlot: { type: Boolean, default: true },
});

const tag = computed(() => (props.useRouter ? RouterLink : 'a'));
const linkProps = computed(() =>
    props.useRouter
        ? { to: props.href }
        : { href: props.href }
);
</script>

<template>
    <component
        :is="tag"
        v-bind="linkProps"
        class="post-card post-card--link"
    >
        <span v-if="note" class="note">{{ note }}</span>

        <div class="post-card__body">
            <h3 class="post-card__title">
                {{ title }}
            </h3>

            <div
                v-if="text"
                class="post-card__text"
                v-html="text"
            />

            <p v-if="cost !== null" class="post-card__cost yellow-text">
                <span>Стоимость в USDT:</span> {{ cost ?? 'Не указана' }}
            </p>
        </div>

        <div v-if="footerSlot" class="post-card__footer">
            <slot name="footer">
                <div v-if="createdAt" class="footСтоимость в USDTer-card-date">
                    <div class="yellow-text"><span>Создано:</span></div>
                    <span class="post-card__date">{{ createdAt }}</span>
                </div>

                <div v-if="deadline" class="footer-card-date">
                    <div class="yellow-text"><span>Дедлайн:</span></div>
                    <span class="post-card__date">{{ deadline }}</span>
                </div>
            </slot>
        </div>
    </component>
</template>

<style scoped>
.post-card--link {
    display: block;
    color: inherit;
    text-decoration: none;
    transition: background .2s ease, transform .15s ease;
}

.post-card--link:hover {
    background: rgb(26 20 90 / 10%);
    transform: translateY(-2px);
    text-decoration: none;
}

/* v-html */
::v-deep(.post-card__text img) {
    border-radius: 3px;
}
</style>
