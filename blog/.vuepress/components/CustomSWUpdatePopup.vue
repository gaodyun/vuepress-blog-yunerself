<template>
  <SWUpdatePopup v-slot="{ enabled, reload, message, buttonText }">
    <div v-if="enabled" class="custom-sw-update-popup">
      {{ message }}<br />
      <button @click="reload">{{ buttonText }}</button>
    </div>
  </SWUpdatePopup>
</template>

<script>
import SWUpdatePopup from "@vuepress/plugin-pwa/lib/SWUpdatePopup.vue";

export default {
  components: { SWUpdatePopup },
};
</script>

<style>
.custom-sw-update-popup {
  position: fixed;
  right: 1em;
  bottom: 1em;
  padding: 1em;
  border: thin solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 3;
}

.custom-sw-update-popup > button {
  background-color: #fff;
  color: #000;
  margin-top: 1em;
  padding: 0.25em 2em;
  border: thin solid #0000ff;
  border-radius: 3px;
  cursor: pointer;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  outline: none;
}

.custom-sw-update-popup > button:hover {
  background-color: rgba(0, 0, 255, 0.8);
  color: #fff;
}

.custom-sw-update-popup-enter-active,
.custom-sw-update-popup-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.custom-sw-update-popup-enter,
.custom-sw-update-popup-leave-to {
  opacity: 0;
  transform: translate(0, 50%) scale(0.5);
}
</style>