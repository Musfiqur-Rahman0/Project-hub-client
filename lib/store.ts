import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

import authReducer from "@/lib/auth-slice";
import submissionsReducer from "@/lib/submissions-slice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      submissions: submissionsReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
