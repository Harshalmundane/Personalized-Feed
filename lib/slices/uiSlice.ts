import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface UIState {
  sidebarOpen: boolean
  activeSection: "feed" | "trending" | "favorites" | "settings"
  isSearchFocused: boolean
  notifications: Array<{
    id: string
    message: string
    type: "success" | "error" | "info"
    timestamp: number
  }>
}

const initialState: UIState = {
  sidebarOpen: true,
  activeSection: "feed",
  isSearchFocused: false,
  notifications: [],
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setActiveSection: (state, action: PayloadAction<UIState["activeSection"]>) => {
      state.activeSection = action.payload
    },
    setSearchFocused: (state, action: PayloadAction<boolean>) => {
      state.isSearchFocused = action.payload
    },
    addNotification: (state, action: PayloadAction<Omit<UIState["notifications"][0], "id" | "timestamp">>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
  },
})

export const { toggleSidebar, setActiveSection, setSearchFocused, addNotification, removeNotification } =
  uiSlice.actions

export default uiSlice.reducer
