<template>
  <div>
    <div style="border: 1px solid blue">
      <div v-for="history in histories" :key="getToPath(history.to)">
        <nuxt-link :to="history.to">{{
          history.tab?.title || history.title
        }}</nuxt-link>
        <button @click="close(history)">关闭</button>
        <button @click="closeOthers(history)">关闭其他</button>
      </div>
      <button @click="closeAll">关闭所有</button>
    </div>
    <slot />
    <div style="border: 1px solid blue">
      <Menu :menu="menus" />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { NuxtLink } from "#components";
import type { FastNavMenuFilled } from "../../src/runtime/types";

const menus = useNavMenus();
const histories = useNavHistories();
const { close, closeAll, closeOthers } = histories;

const Menu = defineComponent({
  props: {
    menu: {
      type: Object as PropType<FastNavMenuFilled>,
      required: true,
    },
  },
  render() {
    return (
      <div>
        <h4>
          {this.menu.to ? (
            <NuxtLink to={this.menu.to}>{this.menu.title}</NuxtLink>
          ) : (
            this.menu.title
          )}
        </h4>
        <ul>
          {this.menu.children.map((item) => {
            if (isNavMenuFilled(item) && !item.show) return;
            if (!isNavMenuFilled(item) && !item.menu.show) return;
            return (
              <li>
                {isNavMenuFilled(item) ? (
                  <Menu menu={item} />
                ) : (
                  <NuxtLink to={item.to}>
                    {item.menu?.title || item.title}
                  </NuxtLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
});
</script>
