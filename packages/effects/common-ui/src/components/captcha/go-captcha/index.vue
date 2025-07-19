<script setup lang="ts">
import type {
  GoClickCaptchaConfig,
  GoClickCaptchaData,
  GoClickCaptchaProps,
} from '../types';

import { ref } from 'vue';

import { Click } from 'go-captcha-vue';

defineOptions({ name: 'GoCaptchaclick' });

const props = withDefaults(defineProps<GoClickCaptchaProps>(), {
  config: () =>
    ({
      width: 300,
    }) satisfies GoClickCaptchaConfig,
  data: () => ({}) as GoClickCaptchaData,
  events: () => ({
    refresh() {},
    click(x, y) {
      console.warn('click', x, y);
    },
    close() {
      console.warn('close');
    },
    confirm(dots, reset) {
      console.warn('confirm', dots, reset);
      return false;
    },
  }),
  onClick: () => () => {},
});

// const modelValue = defineModel<boolean>({ default: false });

// const emit = defineEmits(['onClick']);

// const _isShow = ref(false);

const catchaRef = ref<typeof Click>();

// function _isPass() {
//   modelValue.value = true;
// }
</script>

<template>
  <gocaptcha-click
    class="fixed md:right-full"
    :config="props.config"
    :data="props.data"
    :events="props.events"
    ref="catchaRef"
  />
  <!-- <VbenButton class="w-full" @click="clickCaptcha">点击验证</VbenButton> -->
</template>
