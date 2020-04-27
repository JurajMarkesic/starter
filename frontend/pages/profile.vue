<template>
  <section class="section">
    <div class="container">
      <h2 class="title">My Profile</h2>
      <div class="content">
        <p>
          <strong>Username:</strong>
          {{ loggedInUser.firstName }} {{ loggedInUser.lastName }}
        </p>
        <p>
          <strong>Email:</strong>
          {{ loggedInUser.email }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  middleware: 'auth',

  computed: {
    loggedInUser() {
      return this.$auth.user;
    },
  },
};
</script>
