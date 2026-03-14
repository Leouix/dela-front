<script setup>
import {useNoticeErrorStore} from "@/stores/notice-error.js";

const noticeStore = useNoticeErrorStore()
</script>

<template>

  <Transition id="notice-failed" class="notice-transition" >
    <p v-if="noticeStore.noticeErrorShow">{{ noticeStore.noticeText }}</p>
  </Transition>


</template>

<style scoped>

</style>