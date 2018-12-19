<template>
    <form action="" class="login-form-wrap">
        <div class="login-form">
            <div class="login-form__row error__message"
                 v-if="errorBlock.isActive">{{ errorBlock.message }}</div>
            <div class="login-form__row" v-if="!isLogin">
                <div>
                    <label for="fio" class="login-form__label">ФИО <span class="info">
                    <span class="info__description">Служба доставки выдаст заказ по паспорту</span>
                </span></label>
                </div>
                <div>
                    <input type="text" name="fio" id="fio"
                           placeholder="Фамилия Имя Отчество" class="login-form__input"
                           v-model="fio.value"
                           v-bind:class="[!fio.isValid
                                        && fio.value.length > 0 ? errorClass : '',
                                        fio.isValid ? validClass : '']"
                           @input="validateFio">
                </div>
            </div>
            <div class="login-form__row">
                <div>
                    <label for="email" class="login-form__label">Email</label>
                </div>
                <div>
                    <input type="text" name="email" id="email"
                           class="login-form__input login-form__input_email"
                           v-model="email.value"
                           v-bind:class="[!email.isValid
                                        && email.value.length > 0 ? errorClass : '',
                                        email.isValid ? validClass : '']"
                           @input="validateEmail">
                    <div class="preloader" id="preloader" v-if="emailPending"></div>
                </div>
            </div>
            <div class="login-form__row" v-if="!isLogin">
                <div>
                    <label for="phone" class="login-form__label">Телефон</label>
                </div>
                <div>
                    <input type="tel" minlength="10" name="phone"
                           id="phone" class="login-form__input"
                           v-model="phone.value"
                           v-bind:class="[!phone.isValid
                                        && phone.value.length > 0 ? errorClass : '',
                                        phone.isValid ? validClass : '']"
                           @input="validatePhone">
                </div>
            </div>
            <div class="login-form__row" v-if="isLogin">
                <div>
                    <label for="password" class="login-form__label">Пароль</label>
                </div>
                <div>
                    <input type="password" name="password"
                           id="password" class="login-form__input"
                           v-model="password.value"
                           v-bind:class="[!password.isValid
                                        && password.value.length > 0 ? errorClass : '',
                                        password.isValid ? validClass : '']"
                           @input="validatePassword">
                </div>
                <div class="login-form__row">
                    <password-reset v-bind:login="this.email.value"></password-reset>
                </div>
            </div>
            <div class="login-form__row">
                <button class="login-form__button"
                        v-bind:class="[submitPending ? submitPendingClass : '']"
                        id="login-form-button"
                        @click.prevent="submit">{{ buttonText }}
                </button>
            </div>
        </div>
    </form>
</template>

<script>
import Api from '../plugins/Api';
import Validators from '../plugins/Validators';
import PasswordReset from './PasswordReset.vue';

export default {
  name: 'Registration',
  components: { PasswordReset },
  data() {
    return {
      validClass: 'login-form__input_valid',
      errorClass: 'login-form__input_error',
      submitPendingClass: 'login-form__button_pending',
      emailPending: false,
      submitPending: false,
      errorBlock: {
        isActive: false,
        message: '',
      },
      fio: {
        value: '',
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
      phone: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
      api: new Api(),
      validate: new Validators(),
      isLogin: false,
    };
  },
  computed: {
    buttonText() {
      return this.isLogin ? 'Войти' : 'Зарегистрироваться';
    },
  },
  methods: {
    submit() {
      if (this.isLogin) {
        if (this.email.isValid && this.password.isValid) {
          const loginData = {
            LOGIN: this.email.value,
            PASSWORD: this.password.value,
            REMEMBER: 'N',
          };
          this.submitPending = true;
          this.api.loginUser(loginData).then((resolved) => {
            this.submitPending = false;
            this.errorBlock.isActive = resolved.STATUS === 'ERROR';
            this.errorBlock.message = this.errorBlock.isActive ? resolved.MESSAGE : '';
            if (resolved.STATUS === 'OK') {
              this.$store.commit('authorize');
              this.$store.commit('setName', resolved.DATA.USER.FIRST_NAME);
              this.$store.commit('setLastName', resolved.DATA.USER.LAST_NAME);
            }
          });
        }
      } else if (this.email.isValid && this.fio.isValid
            && (this.phone.isValid || this.phone.value.length === 0)) {
        const regData = {
          EMAIL: this.email.value,
          LAST_NAME: this.fio.value.split(/\s/g)[0],
          NAME: this.fio.value.split(/\s/g)[1],
          SECOND_NAME: this.fio.value.split(/\s/g)[2],
          PERSONAL_PHONE: this.phone.value,
          AUTHORIZE: 'Y',
        };
        this.submitPending = true;
        this.api.registerUser(regData).then((resolved) => {
          this.submitPending = false;
          this.errorBlock.isActive = resolved.STATUS === 'ERROR';
          this.errorBlock.message = this.errorBlock.isActive ? resolved.MESSAGE : '';
          if (resolved.STATUS === 'OK') {
            this.submitPending = true;
            this.api.authChecker().then((auth) => {
              this.submitPending = false;
              if (auth.STATUS === 'OK') {
                this.$store.commit('authorize');
                this.$store.commit('setName', auth.DATA.USER.FIRST_NAME);
                this.$store.commit('setLastName', auth.DATA.USER.LAST_NAME);
              }
            });
          }
        });
      }
    },
    validateFio() {
      this.fio.isValid = this.validate.fio(this.fio.value);
    },
    validateEmail() {
      this.email.isValid = this.validate.email(this.email.value);
      if (this.email.isValid) {
        this.emailPending = true;
        this.api.emailChecker(this.email.value).then((resolved) => {
          this.emailPending = false;
          this.isLogin = resolved.STATUS === 'ERROR';
        });
      } else {
        this.isLogin = false;
      }
    },
    validatePhone() {
      this.phone.isValid = this.validate.phone(this.phone.value);
    },
    validatePassword() {
      this.password.isValid = this.validate.password(this.password.value);
    },
  },
};
</script>
