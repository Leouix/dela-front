<script setup>
import {Link} from '@inertiajs/vue3';

const props = defineProps({
    href: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        default: 'get',
    },
    as: {
        type: String,
        default: 'a',
    },
    active: {
        type: Boolean,
    },
});

</script>

<template>
    <Link
        :href="props.href"
        :method="props.method"
        :as="props.as"
    >
        <slot />
    </Link>
</template>
