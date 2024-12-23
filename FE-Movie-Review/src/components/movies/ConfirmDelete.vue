<script setup></script>

<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-md shadow-lg">
      <div class="text-lg font-semibold mb-4">
        Are you sure you want to delete this movie?
      </div>
      <div class="flex gap-4">
        <button
          @click="deleteMovie"
          class="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
        >
          Yes, Delete
        </button>
        <button
          @click="cancelDelete"
          class="bg-gray-300 hover:bg-gray-200 px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
