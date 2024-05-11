"use client";
import {TOKEN_KEY, USER_NAME_KEY, USER_AVATAR_KEY, TOKEN_REFRESH_KEY, AUTH_URL} from "./utils";
import {axiosInstance} from "./axiosInstance";
import Cookies from 'js-cookie';

// TODO: move to types
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  ip: string;
  role: any;
  token?: string;
}

export type IAuthenticationResponse = {
  token: string,
  expires: number,
  refreshToken: string,
  user: IUser,
};

let user: IUser|null;
function toAvatarUrl(md5Hash: string): string {
  return `https://gravatar.com/avatar/${md5Hash}`
}
function setUser(newUser: IUser|null)  {
  if(newUser){
    user = {
      ...newUser,
      // TODO avatar: sessionHelper.toAvatarUrl(`${newUser.emailHash}`)
    };
    Cookies.set("auth", JSON.stringify(user), {
      expires: 30, // 30 days
      path: "/",
    });
  }else {
    user = newUser
  }
}

async function getUser(): Promise<IUser | null> {
  if (!user && localStorage.getItem(TOKEN_KEY)) {
    const {data} = await axiosInstance.get<IUser>(`${AUTH_URL}/profile`);
    setUser(data);
  }
  return user;
}

const SessionHelper = ()  => {
  return {
    resetUserSession: (data: IAuthenticationResponse) => {
      setUser({
        ...data.user,
      });
      // localStorage.setItem(TOKEN_REFRESH_KEY, data.refreshToken);
      localStorage.setItem(TOKEN_KEY, data.token);
      // localStorage.setItem(USER_NAME_KEY, data.user.name);
      // localStorage.setItem(USER_AVATAR_KEY, toAvatarUrl(`${data.user.emailHash}`));
    },
    removeUserSession: () => {
      setUser(null);
      localStorage.removeItem(TOKEN_REFRESH_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_NAME_KEY);
      localStorage.removeItem(USER_AVATAR_KEY);
    },
    toAvatarUrl: (md5Hash: string): string => {
      return toAvatarUrl(md5Hash);
    },
    getIdentity: async () => {
      return await getUser() ?? null;
    },
  };
};

export const sessionHelper = SessionHelper()
