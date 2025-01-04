export default defineNuxtRouteMiddleware(async (event) => {
  if (process.client) return;
  const { $verifyToken } = useNuxtApp();
  console.log("Auth middleware");
  const jwt = useCookie("notes_jwt");
  console.log(jwt.value);
  if (!jwt.value) {
    return navigateTo("/");
  }
  try {
    await $verifyToken(jwt.value, process.env.JWT_SECRET);
  } catch (error) {
    console.log(error);
    return navigateTo("/");
  }
});
