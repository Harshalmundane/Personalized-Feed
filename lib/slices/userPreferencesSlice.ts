import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface UserPreferences {
  categories: string[]
  favoriteContent: string[]
  darkMode: boolean
  language: string
  feedLayout: "grid" | "list"
}

const initialState: UserPreferences = {
  categories: ["technology", "sports", "finance"],
  favoriteContent: [],
  darkMode: false,
  language: "en",
  feedLayout: "grid",
}

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    updateCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const contentId = action.payload
      const index = state.favoriteContent.indexOf(contentId)
      if (index > -1) {
        state.favoriteContent.splice(index, 1)
      } else {
        state.favoriteContent.push(contentId)
      }
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    setFeedLayout: (state, action: PayloadAction<"grid" | "list">) => {
      state.feedLayout = action.payload
    },
  },
})

export const { updateCategories, toggleFavorite, toggleDarkMode, setLanguage, setFeedLayout } =
  userPreferencesSlice.actions

export default userPreferencesSlice.reducer
