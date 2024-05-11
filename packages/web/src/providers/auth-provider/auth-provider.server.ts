import { AuthProvider } from '@refinedev/core';
import { cookies } from "next/headers";

export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    const cookieStore = cookies();
    const auth = cookieStore.get("auth");

    console.log('authProviderServer check, auth', auth);
    if (auth) {
      return {
        authenticated: true,
      };
    }
    console.log('authProviderServer check redirecting to login')
    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
};
