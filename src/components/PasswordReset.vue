<template>
    <div class="login-form__password-reset"
         @click="resetPassword">Сбросить пароль
    </div>
</template>

<script>
import Api from '../plugins/Api';
import Validators from '../plugins/Validators';

export default {
  name: 'PasswordReset',
  props: {
    login: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      api: new Api(),
      validate: new Validators(),
    };
  },
  methods: {
    resetPassword() {
      if (this.validate.email(this.login)) {
        this.api.resetPassword(this.login).then((resolved) => {
          alert(resolved.MESSAGE);
        });
      }
    },
  },
};
</script>
