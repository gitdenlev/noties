<script setup lang="ts">
import TypeIt from "typeit";
import { ref, onMounted, onBeforeUnmount } from "vue";

const quote = ref(
  '"Words disappear like smoke if they are not captured. Write down your thoughts so you can retrieve them when you need them. This is the only way to preserve an idea that is born in an instant, but can change everything."'
);

let quoteInstance: TypeIt | null = null;

const getQuote = () => {
  new TypeIt("#quote", {
    strings: quote.value,
    speed: 60,
    waitUntilVisible: true,
    loop: true,
  })
    .go()
    .pause(1000)
    .type(" — Unknown Author")
    .pause(10000);
};

onMounted(() => {
  getQuote();
});
</script>

<template>
  <div
    class="hidden xl:block p-10 xl:flex flex-col mx-auto justify-center items-center w-2/3 h-screen text-white"
  >
    <h1
      id="quote"
      class="text-3xl italic text-center leading-relaxed drop-shadow-md"
    ></h1>
  </div>
</template>
