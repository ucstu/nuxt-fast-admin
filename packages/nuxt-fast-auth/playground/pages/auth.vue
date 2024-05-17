<template>
  <div>
    <form
      style="display: flex; flex-direction: column; max-width: 200px"
      @submit.prevent="submit"
    >
      <label>
        用户名：
        <input v-model="form.username" placeholder="username" type="text" >
      </label>
      <label>
        密码：
        <input v-model="form.password" placeholder="password" type="password" >
      </label>
      <label>
        记住我
        <input v-model="remember" type="checkbox" >
      </label>
      <button type="submit">
        {{ type }}
      </button>
      status {{ status }}<br >
      remember {{ remember }}<br >
      token {{ token }}<br >
      user {{ user }}<br >
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: false,
});

const { signIn, signUp, status, remember, token, user } = useAuth();
const type = ref<"login" | "register">("login");
const form = ref({
  username: "",
  password: "",
});
function submit() {
  switch (type.value) {
    case "login":
      signIn(form.value, {
        remember: remember.value,
        navigate: true,
      });
      break;
    case "register":
      signUp(form.value, {
        remember: remember.value,
      });
      break;
  }
}
</script>
