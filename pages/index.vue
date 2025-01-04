<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Report } from "notiflix/build/notiflix-report-aio";
import chalk from "chalk";

const userEmail = ref<string>("");
const userPassword = ref<string>("");
const router = useRouter();

async function submit() {
  try {
    const response = await $fetch("/api/user", {
      method: "POST",
      body: {
        email: userEmail.value,
        password: userPassword.value,
      },
    });
    userEmail.value = "";
    userPassword.value = "";

    const isConfirmed = await Report.success(
      "User created successfully",
      "Welcome to your account",
      "OK",
      {
        backOverlay: true,
        backOverlayClickToClose: true,
        fontFamily: "Quicksand",
        titleFontSize: "20px",
        messageFontSize: "16px",
        buttonFontSize: "16px",
        cssAnimation: true,
        cssAnimationStyle: "zoom",
      }
    );
    navigateTo("/dashboard");
    console.log(chalk.green.bold("WELCOME TO YOUR ACCOUNT"));
  } catch (error) {
    userEmail.value = "";
    userPassword.value = "";
    console.log(error);

    if (
      error.response &&
      error.response._data &&
      error.response._data.message
    ) {
      Notify.failure(error.response._data.message, {
        timeout: 5000,
        position: "left-bottom",
        clickToClose: true,
        pauseOnHover: true,
        fontFamily: "Quicksand",
        fontSize: "16px",
        cssAnimation: true,
        cssAnimationStyle: "from-bottom",
        width: "400px",
      });
    } else {
      Notify.failure("An error occurred. Please try again later.", {
        timeout: 5000,
        position: "left-bottom",
        clickToClose: true,
        pauseOnHover: true,
        fontFamily: "Quicksand",
        fontSize: "16px",
        cssAnimation: true,
        cssAnimationStyle: "from-bottom",
      });
    }
  }
}

useHead({
  title: "Noties - Sign up",
  meta: [
    {
      name: "description",
      content: "Login into your account",
    },
    {
      name: "keywords",
      content: "signup, account, noties",
    },
  ],
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/logo.png",
    },
  ],
})
</script>

<template>
  <div class="flex h-screen bg-zinc-900 xl:bg-zinc-800 text-white">
    <div
      class="xl:w-1/3 w-full flex flex-col justify-center bg-zinc-900 p-10 text-white"
    >
      <div class="md:mx-auto xl:p-4">
        <h1 class="text-3xl font-bold">Sign up for a free account</h1>
        <h2 class="text-lg mt-2">
          Already registered?
          <span class="text-amber-600 underline"
            ><NuxtLink to="/login">Log in</NuxtLink></span
          >
          to your account.
        </h2>
        <form @submit.prevent="submit" class="mt-4">
          <div class="mb-4 md:w-full">
            <label for="email" class="text-xl">Email Address</label>
            <input
              v-model="userEmail"
              type="email"
              id="email"
              class="border-none outline-none w-full mt-2 p-2 rounded bg-zinc-800 text-white placeholder:text-white placeholder:opacity-50"
              placeholder="you@example.com"
            />
          </div>
          <div class="mb-4 md:w-full">
            <label for="password" class="text-xl">Password</label>
            <input
              v-model="userPassword"
              type="password"
              id="password"
              class="border-none outline-none w-full mt-2 rounded p-2 bg-zinc-800 text-white placeholder:text-white placeholder:opacity-50"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            class="md:w-full hover:bg-amber-600 border-none outline-none font-bold transition-all flex items-center justify-center text-black p-2 w-full bg-orange-500 text-black text-xl rounded-full"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
    <GetStarted />
  </div>
</template>
