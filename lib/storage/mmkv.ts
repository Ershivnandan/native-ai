import { createMMKV } from "react-native-mmkv";
import type { MMKV } from "react-native-mmkv";
import type { Storage } from "redux-persist";

export const storage: MMKV = createMMKV({
  id: "myai-storage",
});

export const reduxPersistStorage: Storage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key: string) => {
    storage.remove(key);
    return Promise.resolve();
  },
};
