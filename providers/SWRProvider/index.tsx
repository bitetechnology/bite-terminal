"use client";

import { SWRConfig } from "swr";

const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string, type: RequestType, ...rest) => {
          switch (type) {
            case RequestType.GET:
              return fetch(url).then((res) => {
                return res.json();
              });
            case RequestType.POST:
              return fetch(url).then((res) => {
                return res.json();
              });
            default:
              return fetch(url).then((res) => {
                if (res.status === 200) {
                  return res.json();
                }
              });
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export enum RequestType {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export default SWRProvider;
