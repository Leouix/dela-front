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
    isAuth: (state) => !!state.token,
    isVerified: (state) => state.user?.email_verified_at ?? false,
    isAdmin: (state) => state.user?.is_admin ?? state.user?.role === 'admin' ?? false,
    userMode: (state) => state.user?.mode ?? null,
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
        this.user = res.data.user
      } catch (error) {
        this.logout()
      }
    },

    async logout() {
      try {
        await api.post("/logout")
      } catch (e) {}

      this.user = null
      this.token = null
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
  }
})
