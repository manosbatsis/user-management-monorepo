import {SyntheticEvent} from "react";

export const TOKEN_KEY = "refine-auth";
export const TOKEN_REFRESH_KEY = "refine-refresh-auth";
export const USER_NAME_KEY = "refine-user-identity";
export const USER_AVATAR_KEY = "refine-user-avatar";
export const BASE_URL = "http://localhost:3000"; // TODO process.env.VITE_REACT_APP_API_URL;

export const AUTH_URL = `${BASE_URL}/auth`;

/** Avoid accidental edit via mouse scroll in number TextFields */
export const blurTarget = (event: SyntheticEvent) => {
  event.target instanceof HTMLElement && event.target.blur()
}
