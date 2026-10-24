"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { toast } from "sonner";

import { ApiError, getCurrentUser } from "@/lib/api";
import { clearUser, setLoading, setUser } from "@/lib/auth-slice";
import { clearSubmissions } from "@/lib/submissions-slice";
import { makeStore, useAppDispatch } from "@/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <SessionInitializer />
      {children}
    </Provider>
  );
}

function SessionInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;
    dispatch(setLoading());

    getCurrentUser()
      .then((user) => {
        if (!cancelled) dispatch(setUser(user));
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        dispatch(clearUser());
        dispatch(clearSubmissions());
        if (!(error instanceof ApiError && error.status === 401)) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load your account information.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return null;
}
