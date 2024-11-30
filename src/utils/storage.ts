import { Store } from "tauri-plugin-store-api";

const store = new Store(".store.bin");

export const storeValue = async <T>(key: string, value: T): Promise<void> => {
    await store.set(key, value);
    await store.save();
}

export const reteriveValue = async <T>(key: string): Promise<T | null> => {
    return await store.get(key);
}
