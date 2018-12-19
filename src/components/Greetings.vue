<template>
    <div class="greetings">{{message}}</div>
</template>

<script>
export default {
  name: 'Greetings',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped src="../assets/less/greetings.less"></style>
