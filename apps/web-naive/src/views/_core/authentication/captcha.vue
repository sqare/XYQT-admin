//TODO 验证码组件
<script setup lang="ts">
import { ref } from 'vue';

import { useAuthStore } from '#/store';
// import { Click } from 'go-captcha-vue';

// import 'go-captcha-vue/dist/style.css';

const authStore = useAuthStore();

const clickCaptcha = ref<any>();

const events = {
  confirm: () => {
    // console.log('confirm');
  },
  refresh: () => {
    // console.log('refresh');
  },
};
</script>

<template>
  <Click
    class=""
    :config="{ width: 350 }"
    :data="authStore.captchaData"
    :events="events"
    ref="clickCaptcha"
  />
</template>

<style scoped></style>
