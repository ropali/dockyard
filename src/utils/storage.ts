import { LazyStore } from "@tauri-apps/plugin-store";

const store = new LazyStore(".store.bin");

export const storeValue = async <T>(key: string, value: T): Promise<void> => {
    await store.set(key, value);
    await store.save();
}

export const reteriveValue = async <T>(key: string): Promise<T | undefined> => {
    return await store.get(key);
}
