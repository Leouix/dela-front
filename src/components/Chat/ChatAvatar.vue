<script setup>

const props = defineProps({
    item: Object,
    userRole: String,
});

const getInitials = (title) => {
    const words = title
        ?.replace(/-/g, ' ')
        .trim()
        .split(/\s+/)

    if (words?.length >= 2) {
        return (words[0][0] + words[1][0])?.toUpperCase();
    } else {
        return title?.slice(0, 2)?.toUpperCase();
    }
};

const hasUnread = (item) => {
    if (props.userRole === 'candidate') {
        return item.has_unread_messages_user2;
    } else if (props.userRole === 'company') {
        return item.has_unread_messages_user1;
    }
};
</script>

<template>
  <div
      v-if="item.item_company"
      :class="['company-avatar', hasUnread(item) ? 'has-no-read-message' : ''] ">

    <img
        v-if="item.company_image_url"
        :src="item.company_image_url"
        class="image-avatar"
        alt="company avatar"
    >

    <div class="text-avatar" v-else-if="item.item_title !== null">
      {{ getInitials(item.item_title) }}
    </div>

    <img v-else
         src="/images/default-company.png"
         class="image-avatar"
         alt="company avatar"
    >
  </div>
</template>

