<script setup>
definePageMeta({
  middleware: ["auth"],
});

import { Confirm } from "notiflix/build/notiflix-confirm-aio";

const updatedNote = ref("");
const notes = ref([]);
const selectedNote = ref({});
const textarea = ref("");

async function updateNote() {
  try {
    await $fetch(`/api/notes/${selectedNote.value.id}`, {
      method: "PATCH",
      body: {
        updatedNote: updatedNote.value,
      },
    });
    const noteToUpdate = notes.value.find(
      (note) => note.id === selectedNote.value.id
    );
    if (noteToUpdate) {
      noteToUpdate.text = updatedNote.value;
    }
    selectedNote.value.text = updatedNote.value;
  } catch (error) {
    console.log(error);
  }
}

async function deleteNote() {
  if (!selectedNote.value || !selectedNote.value.id) {
    console.error("No note selected for deletion");
    return;
  }

  Confirm.show(
    "Delete Note",
    "Are you sure you want to delete this note?",
    "Yes",
    "No",
    async () => {
      try {
        await $fetch(`/api/notes/${selectedNote.value.id}`, {
          method: "DELETE",
        });
        const index = notes.value.findIndex(
          (note) => note.id === selectedNote.value.id
        );
        if (index !== -1) {
          notes.value.splice(index, 1);
        }
        selectedNote.value = notes.value[0] || {};
      } catch (error) {
        console.error("Error deleting the note:", error);
      }
    },
    () => {
      console.log("Delete canceled");
    },
    {
      backOverlay: true,
      backOverlayColor: "rgba(0, 0, 0, 0.5)",
      fontFamily: "Quicksand",
      titleFontSize: "20px",
      messageFontSize: "16px",
      cssAnimation: true,
      cssAnimationStyle: "zoom",
      titleColor: "#161717",
      okButtonBackground: "#4CAF50",
      okButtonColor: "#FFFFFF",
      cancelButtonBackground: "#ff3224",
      cancelButtonColor: "#FFFFFF",
    }
  );
}

function logout(e) {
  Confirm.show(
    "Sign out",
    "Do you really want to sign out?",
    "Sign Out",
    "Cancel",
    () => {
      const jwtCookie = useCookie("notes_jwt");
      jwtCookie.value = null;
      navigateTo("/login");
      e.preventDefault();
    },
    () => {
      console.log("Delete canceled");
    },
    {
      backOverlay: true,
      backOverlayColor: "rgba(0, 0, 0, 0.5)", // Полупрозрачный темный фон
      fontFamily: "Quicksand", // Шрифт оставляем
      titleFontSize: "20px", // Размер заголовка оставляем
      messageFontSize: "16px", // Размер текста оставляем
      cssAnimation: true,
      cssAnimationStyle: "zoom",
      titleColor: "#161717",
      okButtonBackground: "#4CAF50", // Мягкий зеленый
      okButtonColor: "#FFFFFF", // Белый текст
      cancelButtonBackground: "#ff3224", // Мягкий оранжевый
      cancelButtonColor: "#FFFFFF", // Белый текст
    }
  );
}

async function createNewNote() {
  try {
    const newNote = await $fetch("/api/notes", {
      method: "POST",
    });
    notes.value.unshift(newNote);
    selectedNote.value = notes.value[0];
    updatedNote.value = "";
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  notes.value = await $fetch("/api/notes");
  if (notes.value.length > 0) selectedNote.value = notes.value[0];
  updatedNote.value = selectedNote.value.text;
});

watch(selectedNote, (newVal) => {
  updatedNote.value = newVal.text; // Обновляем текст в textarea при изменении выбранной заметки
});

useHead({
  title: "Noties - Dashboard",
  meta: [
    {
      name: "description",
      content: "Login into your account",
    },
    {
      name: "keywords",
      content: "home, dashboard, notes, account, noties",
    },
  ],
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/logo.png",
    },
  ],
});
</script>

<template>
  <div class="h-screen bg-zinc-900 text-white flex flex-col xl:flex-row">
    <!-- Sidebar -->
    <aside
      class="w-full xl:w-1/5 bg-zinc-900 xl:bg-zinc-800 p-4 overflow-y-scroll scrollbar scrollbar-thumb-slate-600 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
    >
      <div class="mb-4">
        <p class="flex items-center gap-2 text-2xl font-bold text-zinc-300">
          <Icon name="ph:list-fill" size="30" /> Your notes
        </p>
      </div>
      <ul class="space-y-4">
        <li
          v-for="note in notes"
          :key="note.id"
          @click="selectedNote = note"
          :class="{
            'bg-amber-100/20': note.id === selectedNote.id,
            'hover:bg-amber-100/10': note.id !== selectedNote.id,
          }"
          class="cursor-pointer p-3 rounded-md transition-colors"
        >
          <p class="font-bold truncate">{{ note.text.substring(0, 40) }}</p>
          <p class="text-xs flex items-center gap-2 mt-1">
            <Icon name="clarity:date-line" size="16" />
            {{ new Date(note.createdAt).toLocaleDateString() }}
          </p>
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 flex flex-col justify-between">
      <!-- Header -->
      <header class="flex items-center justify-between">
        <button
          @click="createNewNote"
          class="flex items-center gap-2 text-xl font-bold text-zinc-400 hover:text-zinc-100"
        >
          <Icon name="system-uicons:create" size="24" /> New Note
        </button>
        <button
          @click="logout"
          class="hidden xl:block text-zinc-400 hover:text-zinc-100 xl:flex items-center gap-2 xl:text-s font-bold"
        >
          <Icon name="basil:logout-solid" size="24" /> Log out
        </button>
      </header>

      <!-- Note Editor -->
      <section class="flex-1 my-4">
        <textarea
          v-model="updatedNote"
          @input="updateNote"
          class="w-full h-[200px] xl:h-full bg-zinc-800 p-3 rounded-md text-[#D4D4D4] resize-none outline-none"
          placeholder="Write your note here..."
        ></textarea>
      </section>

      <!-- Footer -->
      <footer class="flex items-center justify-between">
        <button
          @click="logout"
          class="text-zinc-400 hover:text-zinc-100 flex items-center gap-2 text-md font-bold xl:hidden"
        >
          <Icon name="basil:logout-solid" size="20" /> Log out
        </button>
        <button
          @click="deleteNote"
          class="text-red-500 hover:text-red-700 transition-colors"
        >
          <Icon name="mynaui:trash" size="30" />
        </button>
      </footer>
    </main>
  </div>
</template>
