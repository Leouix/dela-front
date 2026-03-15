import { defineStore } from "pinia"
import api from "@/api/axios"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null
  }),

  getters: {
    isAuth: (state) => !!state.token
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const res = await api.post("/login", credentials)

        this.token = res.data.token
        this.user = res.data.user
        localStorage.setItem("token", res.data.token)

        return true
      } catch (error) {
        this.error = error.response?.data?.message || "Login failed"
        return false
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if (!this.token) return

      try {
        const res = await api.get("/user")
        this.user = res.data
      } catch (error) {
        this.logout()
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
  }
})
