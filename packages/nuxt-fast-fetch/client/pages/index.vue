<template>
  <div class="relative n-bg-base flex flex-col h-screen">
    <div v-if="options.length" class="w-full h-full">
      <div class="relative flex justify-between">
        <n-select-tabs v-model="current" :options="options" />
        <n-button :disabled="!rpc || refreshing" @click="refresh">
          <n-loading v-if="refreshing" />
          <span v-else>Refresh</span>
        </n-button>
      </div>
      <rapi-doc
        v-if="showRapiDoc"
        :spec-url="currentDoc?.url"
        render-style="read"
        style="flex: 1"
      />
    </div>
    <div v-else class="w-full h-full flex justify-center items-center">
      <n-icon icon="tabler:mood-empty" />
      <span class="ml-2">No documents found</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onDevtoolsClientConnected } from "@nuxt/devtools-kit/iframe-client";
import type { BirpcReturn } from "birpc";
interface Document {
  name: string;
  url: string;
}
interface ClientFunctions {}
interface ServerFunctions {
  getDocuments(): Array<Document>;
  refreshDocument(name: string): void;
}

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
    value: doc.name,
  }));
});

const currentDoc = computed(() => {
  return documents.value.find((doc) => doc.name === current.value);
});

onDevtoolsClientConnected(async (client) => {
  rpc.value = client.devtools.extendClientRpc<ServerFunctions, ClientFunctions>(
    RPC_NAMESPACE,
    {},
  );

  documents.value = await rpc.value.getDocuments();
  current.value = documents.value[0]?.name;
});

async function refresh() {
  try {
    refreshing.value = true;
    await rpc.value?.refreshDocument(current.value);
    showRapiDoc.value = false;
    await nextTick(() => (showRapiDoc.value = true));
  } finally {
    refreshing.value = false;
  }
}
</script>
