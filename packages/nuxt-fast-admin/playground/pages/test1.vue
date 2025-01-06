<template>测试页面</template>

<script lang="tsx" setup>
definePageMeta({
  icon: 'logos:testcafe',
  title: '测试页面',
  desc: '测试页面描述',
  layout: 'default',
  head: {
    has: true,
  },
  menu: {
    has: true,
    order: 1,
    desc: '测试页面描述(覆盖)',
    disabled: false,
    icon: 'logos:testcafe',
    parent: 'test',
    show: true,
    title: '测试页面(覆盖)',
  },
  tab: {
    desc: '测试页面描述(覆盖)',
    has: true,
    icon: 'logos:testcafe',
    show: true,
    title: '测试页面(覆盖)',
  }
});
</script>
