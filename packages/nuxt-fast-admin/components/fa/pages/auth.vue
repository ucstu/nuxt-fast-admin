<template>
  <div class="fast-admin-page-auth">
    <div class="fast-admin-page-auth-box">
      <slot name="image" :picture="authConfig!.picture">
        <img
          v-if="authConfig!.picture"
          class="fast-admin-page-auth-box-img"
          :src="authConfig!.picture"
          alt="pic"
        >
      </slot>
      <slot
        name="form"
        :model="authForm"
        :rules="authFormRules"
        :auth-type="authType"
        :forgot="authConfig!.forget"
        :register="authConfig!.register"
        :remember="authConfig!.remember"
        :loading="status[authType!]"
        :submit="submitForm"
      >
        <n-form
          ref="authFormRef"
          class="fast-admin-page-auth-box-form"
          :model="authForm"
          :rules="authFormRules"
          :label-width="80"
        >
          <slot
            name="form-header"
            :logo="adminConfig!.logo"
            :_name="adminConfig!.name"
          >
            <div class="fast-admin-page-auth-box-form-header">
              <img
                class="fast-admin-page-auth-box-form-header-logo"
                :src="adminConfig!.logo"
                alt="logo"
              >
              <h1>{{ adminConfig.name }}</h1>
            </div>
          </slot>
          <slot :model="authForm" :auth-type="authType">
            <n-form-item label="用户名" path="username">
              <n-input
                v-model:value="authForm.username"
                placeholder="请输入用户名"
              />
            </n-form-item>
            <n-form-item label="密码" path="password">
              <n-input
                v-model:value="authForm.password"
                type="password"
                placeholder="请输入密码"
              />
            </n-form-item>
            <n-form-item
              v-if="authType === 'signUp'"
              label="重复密码"
              path="repeat"
            >
              <n-input
                v-model:value="authForm.repeat"
                type="password"
                placeholder="请重复密码"
              />
            </n-form-item>
            <slot name="form-extra" :model="authForm" :auth-type="authType" />
          </slot>
          <slot
            name="form-footer"
            :auth-type="authType"
            :forgot="authConfig!.forget"
            :register="authConfig!.register"
            :remember="authConfig!.remember"
          >
            <n-form-item>
              <div class="fast-admin-page-auth-box-form-footer">
                <label v-if="authConfig!.remember" style="display: flex">
                  <input v-model="remember" type="checkbox" >
                  &nbsp;记住我
                </label>
                <n-button
                  v-if="authConfig!.forget && authType === 'signIn'"
                  text
                  @click="authConfig!.hooks!.forget"
                >
                  忘记密码
                </n-button>
                <n-button
                  v-if="authType === 'signIn' ? authConfig!.register : true"
                  text
                  @click="changeAuthType"
                >
                  前往{{ authType === "signIn" ? "注册" : "登录" }}
                </n-button>
              </div>
            </n-form-item>
          </slot>
          <slot
            name="form-action"
            :auth-type="authType"
            :loading="status[authType!]"
            :submit="submitForm"
          >
            <n-form-item>
              <n-button
                class="fast-admin-page-auth-box-form-action"
                type="primary"
                :loading="status[authType!]"
                @click="submitForm"
              >
                {{ authType === "signIn" ? "登录" : "注册" }}
              </n-button>
            </n-form-item>
          </slot>
        </n-form>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FsAuthForm } from "@ucstu/nuxt-fast-auth/module";
import { computedEager } from "@vueuse/core";
import defu from "defu";
import type { FormInst, FormRules } from "naive-ui";
import { FetchError } from "ofetch";

const router = useRouter();
const adminConfig = useAppConfigRef("fastAdmin");
const authConfig = useAppConfigRef("fastAdmin.pages.auth");
const { signIn, signUp, status } = useAuth();

const background = computedEager(() =>
  authConfig.value!.background
    ? `url(${authConfig.value!.background})`
    : "none",
);

const remember = defineModel<boolean>("remember", { default: false });
const authType = defineModel<"signIn" | "signUp">("authType", {
  default: "signIn",
});
const authForm = defineModel<
  FsAuthForm & {
    repeat?: string;
  }
>("authForm", {
  default: {},
});
const authFormRef = ref<FormInst>();
const authFormRules = defineModel<FormRules>("authFormRules", {
  default: {},
  get(v) {
    return defu(v, {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
      ],
      repeat: [
        {
          required: true,
          message: "请重复密码",
          trigger: "blur",
        },
        {
          validator: (rule: any, value: string) => {
            if (value !== authForm.value.password) {
              return Promise.reject("两次输入的密码不一致，请重新输入");
            }
            return Promise.resolve();
          },
          trigger: "blur",
        },
      ],
    });
  },
});

async function submitForm() {
  try {
    await authFormRef.value?.validate();
  } catch (error) {
    return;
  }
  const back = router.options.history.state.back as string;
  const navigate =
    [router.currentRoute.value.query.callback].flat()[0] ||
    (back !== router.currentRoute.value.path ? back : undefined) ||
    true;
  const options = { navigate, remember: remember.value };
  try {
    await [signIn, signUp][authType.value === "signIn" ? 0 : 1](
      authForm.value,
      options,
    );
  } catch (error) {
    if (error instanceof FetchError) {
      handleError(error);
    }
  }
}

async function changeAuthType() {
  if (authType.value === "signIn" && authConfig.value?.hooks?.signUp) {
    await authConfig.value.hooks.signUp();
    return;
  }
  authType.value = authType.value === "signIn" ? "signUp" : "signIn";
}
</script>

<style>
.fast-admin-page-auth {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: v-bind(background);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.fast-admin-page-auth-box {
  position: relative;
  margin: 0 20px;
  max-width: 1024px;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: rgb(255 255 255 / 1);
  box-shadow: 0 0 4px rgb(0 0 0 / 20%);
}

@media (min-width: 768px) {
  .fast-admin-page-auth-box {
    flex-direction: row;
  }
}

.fast-admin-page-auth-box-img {
  display: none;
  width: 50%;
  object-fit: contain;
}

@media (min-width: 768px) {
  .fast-admin-page-auth-box-img {
    display: block;
  }
}

.fast-admin-page-auth-box-form {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
}

.fast-admin-page-auth-box-form-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.fast-admin-page-auth-box-form-header-logo {
  width: 40px;
  margin-right: 10px;
}

.fast-admin-page-auth-box-form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.fast-admin-page-auth-box-form-action {
  width: 100%;
}
</style>
