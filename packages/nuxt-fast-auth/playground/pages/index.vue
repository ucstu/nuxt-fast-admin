<template>
  <div>
    Nuxt module playground!
    <button
      @click="
        signIn({
          username: '1',
          password: '1',
        })
      "
    >
      user: {{ user }}<br >
      token: {{ token }}<br >
      admin: {{ auth("admin") }}
    </button>
    <!-- <el-input :readonly="!auth('admin')" type="text" value="admin" /> -->
    <button
      @click="
        signOut({
          navigate: true,
        })
      "
    >
      sinout
    </button>
    <nuxt-link to="/user"> to user </nuxt-link>
    <nuxt-link to="/admin"> to admin </nuxt-link>
    <nuxt-link to="/auth"> to auth </nuxt-link>
  </div>
</template>

<script setup lang="tsx">
const { user, token, signIn, signOut } = useAuth();

const ElInput = defineComponent({
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    return () => (
      <input readonly={props.readonly} type={props.type} value={props.value} />
    );
  },
});
</script>
