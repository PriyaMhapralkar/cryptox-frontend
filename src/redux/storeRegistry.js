let storeInstance = null;

export const injectStore = (store) => {
  storeInstance = store;
};

export const getStore = () => storeInstance;