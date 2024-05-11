"use client";

import dataProviderSimpleRest from "@refinedev/simple-rest";
import {BASE_URL} from "../utils";
import { axiosInstance } from '../axiosInstance';


export const dataProvider = dataProviderSimpleRest(BASE_URL, axiosInstance);

