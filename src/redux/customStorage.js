// customStorage.js
const createNoopStorage = () => {
    return {
      getItem() {
        return Promise.resolve(null);
      },
      setItem(key, value) {
        return Promise.resolve(value);
      },
      removeItem() {
        return Promise.resolve();
      }
    };
  };
  
  const storage = typeof window !== 'undefined' 
    ? require('redux-persist/lib/storage').default 
    : createNoopStorage();
  
  export default storage;