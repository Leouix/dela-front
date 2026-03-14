<script setup>
import {useNoticeSuccessStore} from "@/stores/notice-success.js";

const noticeStore = useNoticeSuccessStore()
</script>

<template>

  <Transition id="notice-success" class="notice-transition" >
    <p v-if="noticeStore.noticeSuccessShow">Success!</p>
  </Transition>


</template>
