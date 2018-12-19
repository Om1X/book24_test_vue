<template>
    <registration v-if="!isAuthorized"></registration>
    <greetings v-else v-bind:message="message"/>
</template>

<script>
import Registration from './Registration.vue';
import Greetings from './Greetings.vue';

export default {
  name: 'LoginForm',
  components: { Greetings, Registration },
  props: {
  },
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    fullName() {
      return this.$store.getters.getFullName;
    },
    message() {
      return `Добро пожаловать ${this.fullName}!`;
    },
  },
};
</script>

<style lang="less" src="../assets/less/loginForm.less"></style>
