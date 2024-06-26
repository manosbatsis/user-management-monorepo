"use client";
import {AUTH_URL, TOKEN_KEY, TOKEN_REFRESH_KEY} from "./utils";
import axios, {
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { IAuthenticationResponse, sessionHelper } from './sessionHelper';
import {HttpError} from "@refinedev/core";

axios.defaults.baseURL = process.env.VITE_REACT_APP_API_URL;
axios.defaults.timeout = 20000;

const axiosInstance = axios.create();

// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest: any) => {
  const refreshToken = localStorage.getItem(TOKEN_REFRESH_KEY);
  if(!refreshToken) return Promise.resolve();
  console.debug("Refreshing auth token...");
  return axios.create()
      .post<IAuthenticationResponse>(`${AUTH_URL}/auth-refresh`, {
        refreshToken
      })
      .then((tokenRefreshResponse: AxiosResponse<IAuthenticationResponse>) => {
        sessionHelper.resetUserSession(tokenRefreshResponse.data);
        failedRequest.response.config.headers["Authorization"] = `Bearer ${tokenRefreshResponse.data.token}`;
        console.debug("Refreshed auth token");
        return Promise.resolve();
      });
}

// Instantiate the interceptor
createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
  statusCodes: [401, 403], // default: [ 401 ]
});

axiosInstance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    if (request.headers) {
      request.headers["Authorization"] = `Bearer ${token}`;
    } else {
      request.headers = {
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
  }

  return request;
});

axiosInstance.interceptors.response.use(
    (response: any) => {
      return response;
    },
    (error: HttpError) => {
      const customError: HttpError = {
        ...error,
        errors: error.response?.data?.errors,
        message: error.response?.data?.message,
        statusCode: error.response?.status,
      };

      return Promise.reject(customError);
    },
);


export {axiosInstance};
