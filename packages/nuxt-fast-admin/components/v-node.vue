<script lang="tsx">
import type { VNode, VNodeChild } from "vue";

export default defineComponent({
  name: "VNode",
  props: {
    node: {
      type: [String, Object, Function] as PropType<
        string | VNode | VNodeChild | (() => string | VNode | VNodeChild)
      >,
      required: true,
    },
  },
  render() {
    return typeof this.node === "function" ? this.node() : this.node;
  },
});
</script>
