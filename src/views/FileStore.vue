<!-- YourVueComponent.vue -->

<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <div v-if="storedFile">
      <p>Stored File:</p>
      <p>Name: {{ storedFile.name }}</p>
      <p>Type: {{ storedFile.type }}</p>
      <p>Size: {{ storedFile.size }} bytes</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storedFile: null,
    };
  },

  mounted() {
    this.loadFileReferenceFromLocalStorage();
  },

  methods: {
    handleFileChange(event) {
      const fileInput = event.target;
      const selectedFile = fileInput.files[0];

      if (!selectedFile) {
        console.error('No file selected.');
        return;
      }

      this.storeFileInIndexedDB(selectedFile);
      console.log('File stored in IndexedDB');

      // Update the displayed file
      this.storedFile = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      };

      // Store a reference in local storage
      this.storeFileReferenceInLocalStorage(selectedFile.name);
    },

    storeFileInIndexedDB(file) {
      const dbName = 'my-db';
      const storeName = 'files';

      const request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(storeName);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        const key = file.name;

        const request = store.put(file, key);

        request.onerror = (error) => {
          console.error('Error storing file in IndexedDB:', error);
        };
      };

      request.onerror = (error) => {
        console.error('Error opening IndexedDB:', error);
      };
    },

    storeFileReferenceInLocalStorage(key) {
      localStorage.setItem('fileReference', key);
    },

    loadFileReferenceFromLocalStorage() {
      const key = localStorage.getItem('fileReference');

      if (key) {
        this.loadFileFromIndexedDB(key);
      }
    },

    loadFileFromIndexedDB(key) {
      const dbName = 'my-db';
      const storeName = 'files';

      const request = indexedDB.open(dbName, 1);

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);

        const getRequest = store.get(key);

        getRequest.onsuccess = (event) => {
          const storedFile = event.target.result;
          if (storedFile) {
            this.storedFile = {
              name: storedFile.name,
              type: storedFile.type,
              size: storedFile.size,
            };
          }
        };

        getRequest.onerror = (error) => {
          console.error('Error loading file from IndexedDB:', error);
        };
      };

      request.onerror = (error) => {
        console.error('Error opening IndexedDB:', error);
      };
    },
  },
};
</script>

<style>
/* Your component styles here */
</style>
