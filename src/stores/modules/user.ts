import { defineStore } from "pinia";
import { UserState, UserMessage } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "geeker-user",
  state: (): UserState => ({
    token: "",
    userInfo: { name: "Geeker" }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("geeker-user")
});

export const setUseNameStore = defineStore({
  id: "user",
  state: (): UserMessage => ({
    userName: "Geeker"
  }),
  getters: {},
  actions: {
    // Set setUserInfo
    setUserName(userName: string) {
      this.userName = userName;
    }
  },
  persist: piniaPersistConfig("user")
});
