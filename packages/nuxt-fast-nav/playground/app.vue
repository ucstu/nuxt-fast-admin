<template>
  <div v-for="history in histories" :key="history.path">
    <nuxt-link :to="history">
      {{ history.name }}
      <button @click.prevent="closePage(history)">close</button>
    </nuxt-link>
  </div>
  <button @click="closePage()">close current</button>
  <NuxtPage />
  <div
    v-for="menu in menus.children"
    :key="isFsNavMenu(menu) ? menu.key : menu.path"
  >
    <Menu :option="menu" />
  </div>
</template>

<script setup lang="tsx">
import { NuxtLink } from "#components";
import { type FsNavMenuOrPage } from "../src/module";

const { menus, histories, closePage } = useNav();

const Menu = defineComponent({
  props: {
    /* eslint-disable-next-line vue/require-default-prop */
    option: Object as PropType<FsNavMenuOrPage>,
  },
  setup(props) {
    return () => {
      return (
        <div>
          {props.option &&
            (isFsNavMenu(props.option) ? (
              props.option.children?.map((menuOrPage) => (
                <Menu option={menuOrPage} />
              ))
            ) : (
              <NuxtLink to={props.option.path}>
                {props.option.menu.title}
              </NuxtLink>
            ))}
        </div>
      );
    };
  },
});
</script>
