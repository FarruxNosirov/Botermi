import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  locale: 'uz' | 'ru';
}

const initialState: LanguageState = {
  locale: 'uz', // default
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'uz' | 'ru'>) => {
      state.locale = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
