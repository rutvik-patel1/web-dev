<template>
  <div class="container">
    <div class="input-container">
      <input
        v-model="inputText"
        @keyup.enter="addItem"
        placeholder="Enter text"
      />
      <button @click="addItem">Submit</button>
    </div>

    <ul class="item-list">
      <li v-for="(item, index) in itemList" :key="index">
        <span>{{ item.text }}</span>
        <button @click="editItem(item.id)">Edit</button>
        <button @click="deleteItem(item.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  addTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
} from "../shared/IndexedDB.js";

export default {
  data() {
    return {
      inputText: "",
      itemList: [],
    };
  },
  async created() {
    this.itemList = await getAllTodos();
  },
  methods: {
    async addItem() {
      if (this.inputText.trim() !== "") {
        const todo = { text: this.inputText };
        await addTodo(todo);
        this.itemList.push({ ...todo, id: this.itemList.length + 1 });
        this.inputText = "";
      }
    },
    async deleteItem(id) {
      await deleteTodo(id);
      this.itemList = this.itemList.filter((item) => item.id !== id);
    },
    async editItem(id) {
      const newText = prompt(
        "Edit item:",
        this.itemList.find((item) => item.id === id).text
      );
      if (newText !== null) {
        await updateTodo(id, newText);
        this.itemList.find((item) => item.id === id).text = newText;
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
}

.input-container {
  display: flex;
  margin-bottom: 10px;
}

input {
  flex: 1;
  padding: 8px;
  margin-right: 8px;
}

button {
  padding: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.item-list {
  list-style: none;
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

span {
  flex: 1;
}
</style>
