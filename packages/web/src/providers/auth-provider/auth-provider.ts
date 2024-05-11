"use client";
import {AuthBindings, HttpError} from "@refinedev/core";

import {AUTH_URL} from "../utils";
import { IAuthenticationResponse, sessionHelper } from '../sessionHelper';
import { axiosInstance } from "../axiosInstance";

export const authProvider: AuthBindings = {
    register: async ({ email, password }) => {
      // Check if user exists
      const existsRes = await axiosInstance.post<{ result:boolean }>(`${AUTH_URL}/exists`, {
        email,
      });
      if (existsRes.data.result) {
        return {
          success: false,
          error: {
            name: "Registration Error",
            message: "User already exists",
          },
        };
      }

      // Register new user
      const { data } = await axiosInstance.post<IAuthenticationResponse>(`${AUTH_URL}`, {
        email,
        password
      });

      console.log("register redirecting to login")
      return {
        success: true,
        redirectTo: "/login",
      };
    },
    login: async ({ email,password }) => {
      try {
        const { data } = await axiosInstance.post<IAuthenticationResponse>(`${AUTH_URL}/login`, {
          email: email,
          password: password
        });

        sessionHelper.resetUserSession(data);

        return {
          success: true,
          redirectTo: "/",
        };
      } catch (error: any) {
        return {
          success: false,
          error: error,
        };
      }
    },
    logout: async (props) => {
      sessionHelper.removeUserSession();
      console.log("logout redirecting to login")
      return {
        success: true,
        redirectTo: props?.redirectPath || "/login",
      };
    },
    onError: async (error) => {
      if (error?.response?.status === 401) {
        return {
          redirectTo: "/register",
          error,
        };
      }

      return {
        error,
      };
    },
    check: async () => {
      if (!await sessionHelper.getIdentity()) {
        console.log("check redirecting to login")
        return {
          authenticated: false,
          error: new Error("No token found"),
          redirectTo: "/login",
        };
      }
      return {
        authenticated: true,
      };
    },
    getPermissions: async () => {
      const user = await sessionHelper.getIdentity()
      if(user && user.role)
        return [user?.role];
      else
        return []
    },
    getIdentity: () => {
      return sessionHelper.getIdentity();
    }
};

/*

import { AuthBindings } from "@refinedev/core";
import Cookies from "js-cookie";

const mockUsers = [
  {
    name: "John Doe",
    email: "johndoe@mail.com",
    roles: ["admin"],
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Jane Doe",
    email: "janedoe@mail.com",
    roles: ["editor"],
    avatar: "https://i.pravatar.cc/150?img=1",
  },
];

export const authProvider: AuthBindings = {
  login: async ({ email, username, password, remember }) => {
    // Suppose we actually send a request to the back end here.
    const user = mockUsers[0];

    if (user) {
      Cookies.set("auth", JSON.stringify(user), {
        expires: 30, // 30 days
        path: "/",
      });
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    Cookies.remove("auth", { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser.roles;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser;
    }
    return null;
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};

 */
