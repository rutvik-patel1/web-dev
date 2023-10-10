<template>
  <div>
    <h1>{{ msg }}</h1>
    <ul>
      <li><router-link to="/indexed-db">1. IndexedDB</router-link></li>
      <li><router-link to="/indexed-db-file">2. File/ Blob Store</router-link></li>
      <li><router-link to="/">3.</router-link></li>
      <li><router-link to="/">4.</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
ul {
  max-width: 400px;
  margin: auto;
  padding: 0;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #ddd;
  margin-bottom: 8px;
}
</style>
