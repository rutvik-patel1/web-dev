// IndexedDB.js

const DB_NAME = 'todo_database';
const OBJECT_STORE_NAME = 'todos';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
};

export const addTodo = async (todo) => {
  const db = await openDB();
  const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(OBJECT_STORE_NAME);
  store.add(todo);
};

export const getAllTodos = async () => {
  const db = await openDB();
  const transaction = db.transaction(OBJECT_STORE_NAME, 'readonly');
  const store = transaction.objectStore(OBJECT_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = function (event) {
      resolve(event.target.result);
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
};

export const updateTodo = async (id, newText) => {
    const db = await openDB();
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(OBJECT_STORE_NAME);
    
    const request = store.get(id);
  
    request.onsuccess = function(event) {
      const todo = event.target.result;  
      const updatedTodo = { ...todo, text: newText };
      const updateRequest = store.put(updatedTodo);
      updateRequest.onerror = function(event) {
        console.error('Error updating todo:', event.target.error);
      };
    };
  
    request.onerror = function(event) {
      console.error('Error fetching todo for update:', event.target.error);
    };
  };
  

export const deleteTodo = async (id) => {
  const db = await openDB();
  const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(OBJECT_STORE_NAME);
  store.delete(id);
};
