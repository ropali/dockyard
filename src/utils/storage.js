import { Store } from "tauri-plugin-store-api";

const store = new Store("/home/ropali/.dockyard/store.bin");


export const storeValue = async (key, value) => {

    await store.set(key, value);
    await store.save();
}


export const reteriveValue = async (key) => {
    return await store.get(key);
}



