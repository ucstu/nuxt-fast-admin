<template>
  <div class="relative n-bg-base flex flex-col h-screen">
    <div class="relative flex justify-between">
      <n-select-tabs v-model="current" :options="options" />
      <n-button :disabled="!rpc || refreshing" @click="refreshDocument">
        刷新
      </n-button>
    </div>
    <rapi-doc
      :spec-url="current"
      render-style="read"
      style="flex: 1"
    >
    </rapi-doc>
  </div>
</template>

<script lang="ts">
interface Document {
  name: string;
  url: string;
}
interface ClientFunctions {
  reloadDocument(): void;
}
interface ServerFunctions {
  getDocuments(): Array<Document>;
  refreshDocument(name: string): void;
}
</script>

<script setup lang="ts">
import { onDevtoolsClientConnected } from "@nuxt/devtools-kit/iframe-client";
import type { BirpcReturn } from "birpc";

useHead({
  script: [
    {
      type: "module",
      src: "https://unpkg.com/rapidoc/dist/rapidoc-min.js",
    },
  ],
});

const RPC_NAMESPACE = "fast-fetch-rpc";

const current = ref<string>("");
const showRapiDoc = ref<boolean>(true);
const refreshing = ref<boolean>(false);
const documents = ref<Array<Document>>([]);
const rpc = shallowRef<BirpcReturn<ServerFunctions, ClientFunctions>>();

const options = computed(() => {
  return documents.value.map((doc) => ({
    label: doc.name,
    value: doc.url,
  }));
});

onDevtoolsClientConnected(async (client) => {
  rpc.value = client.devtools.extendClientRpc<ServerFunctions, ClientFunctions>(
    RPC_NAMESPACE,
    {
      async reloadDocument() {
        showRapiDoc.value = false;
        await nextTick(() => {
          showRapiDoc.value = true;
        });
      },
    }
  );

  documents.value = await rpc.value.getDocuments();
  current.value = documents.value[0]?.url;
});

async function refreshDocument() {
  try {
    refreshing.value = true;
    await rpc.value?.refreshDocument(current.value);
  } finally {
    refreshing.value = false;
  }
}
</script>
