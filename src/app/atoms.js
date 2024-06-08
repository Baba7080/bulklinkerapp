import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist'



const { persistAtom } = recoilPersist({
  key: 'recoil-persist', // this key is using to store data in local storage
  storage: sessionStorage, // configure which storage will be used to store the data
  converter: {
    stringify: (value) => (btoa(JSON.stringify(value))),
    parse: (value) => JSON.parse(atob(value))
  } // configure how values will be serialized/deserialized in storage
})
export const userDetailsState = atom({
  key: "userDetailsState",
  default: { user_details: {}, login: false },
  effects_UNSTABLE: [persistAtom]
})