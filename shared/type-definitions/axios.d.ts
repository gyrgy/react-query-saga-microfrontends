// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    withBaseUrl?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    withBaseUrl?: boolean;
  }
}
