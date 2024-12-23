<script setup></script>

<template>
  <button
    class="flex justify-center items-center py-[3px] rounded-full bg-primary text-white w-full hover:bg-secondary-200"
  >
    <slot name="main">Button Text</slot>
  </button>
</template>

<style scoped></style>
