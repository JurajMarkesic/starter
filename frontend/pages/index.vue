<template>
  <div class="container">
    <div>
      <h1 class="title">
        Starter app
      </h1>
      <h2 class="subtitle">
        <!-- <nuxt-link class="navbar-item" to="/register">Register</nuxt-link>
        <nuxt-link class="navbar-item" to="/login">Log In</nuxt-link>
        <nuxt-link class="navbar-item" to="/profile">My Profile</nuxt-link> -->
      </h2>
      <div v-if="isLoggedIn">
        <h4>Hi {{ user.firstName }}</h4>
        <nuxt-link class="navbar-item" to="/profile">My Profile</nuxt-link>
        <button class="button is-dark is-fullwidth" @click.prevent="logout">
          Log out
        </button>
      </div>
      <div v-else>
        <h3 v-if="registerForm.error">{{ registerForm.error }}</h3>
        <h3>Register:</h3>
        <form method="post" @submit.prevent="register">
          <div class="field">
            <label class="label">firstName</label>
            <div class="control">
              <input v-model="registerForm.firstName" type="text" class="input" name="firstName" required />
            </div>
          </div>
          <div class="field">
            <label class="label">lastName</label>
            <div class="control">
              <input v-model="registerForm.lastName" type="text" class="input" name="lastName" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input v-model="registerForm.email" type="email" class="input" name="email" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input v-model="registerForm.password" type="password" class="input" name="password" required />
            </div>
          </div>
          <div class="control">
            <button type="submit" class="button is-dark is-fullwidth">
              Register
            </button>
          </div>
        </form>

        <br />
        <br />
        <br />

        <h3 v-if="loginForm.error">{{ loginForm.error }}</h3>
        <h3>Login:</h3>
        <form method="post" @submit.prevent="login">
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input v-model="loginForm.email" type="email" class="input" name="email" />
            </div>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input v-model="loginForm.password" type="password" class="input" name="password" />
            </div>
          </div>
          <div class="control">
            <button type="submit" class="button is-dark is-fullwidth">Log In</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      registerForm: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        error: null,
      },
      loginForm: {
        email: '',
        password: '',
        error: null,
      },
    };
  },

  computed: {
    ...mapState({
      isLoggedIn: (state) => state.auth.loggedIn,
      user: (state) => state.auth.user,
    }),
  },

  methods: {
    // test comment
    async register() {
      try {
        await this.$store.dispatch('users/register', {
          firstName: this.registerForm.firstName,
          lastName: this.registerForm.lastName,
          email: this.registerForm.email,
          password: this.registerForm.password,
        });

        await this.$auth.loginWith('local', {
          data: {
            email: this.registerForm.email,
            password: this.registerForm.password,
          },
        });

        this.$router.push('/profile');
      } catch (e) {
        console.log('register -> e', e);
        this.registerForm.error = e.response.data.message;
      }
    },
    async login() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.loginForm.email,
            password: this.loginForm.password,
          },
        });
      } catch (e) {
        console.log('login -> e', e);
        this.loginForm.error = e.response.data.message;
      }
    },
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
