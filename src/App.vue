<template>
  <div id="app">
    <LoginForm/>
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue';
import store from './store';
import Api from './plugins/Api';

export default {
  name: 'app',
  store,
  components: {
    LoginForm,
  },
  data() {
    return {
      api: new Api(),
    };
  },
  mounted() {
    this.api.authChecker().then((auth) => {
      if (auth.STATUS === 'OK') {
        this.$store.commit('authorize');
        this.$store.commit('setName', auth.DATA.USER.FIRST_NAME);
        this.$store.commit('setLastName', auth.DATA.USER.LAST_NAME);
      }
    }, (rejected) => {
      console.log(rejected);
    });
  },
};
</script>

<style lang="less" src="./assets/less/base.less"></style>
