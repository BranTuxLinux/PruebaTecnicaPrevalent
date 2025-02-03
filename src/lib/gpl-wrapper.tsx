"use client";
import React from "react";
import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
const URL_URI = process.env.NODE_ENV === "production" ? "https://fms-brantuxlinuxs-projects.vercel.app" : "http://localhost:3000"
function makeClient() {
  const httpLink = new HttpLink({
    uri: `${URL_URI}/api/graphql`,
    
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([

            new SSRMultipartLink({
              stripDefer: true,

            }),
            httpLink,
          ])
        : httpLink,
  });
}
export function ApolloWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
