import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { Refine, GitHubBanner } from "@refinedev/core";
import { DevtoolsProvider } from "@providers/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { notificationProvider, RefineSnackbarProvider, Title } from '@refinedev/mui';
import routerProvider from "@refinedev/nextjs-router";

import { dataProvider } from "@providers/data-provider";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { authProvider } from "@providers/auth-provider";

export const metadata: Metadata = {
  title: "User Admin",
  description: "Sample application for business user management",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en">
      <body>
        <Suspense>
          <RefineKbarProvider>

            <ColorModeContextProvider defaultMode={defaultMode}>
              <RefineSnackbarProvider>


                {/*<DevtoolsProvider>*/}
                  <Refine
                    routerProvider={routerProvider}
                    dataProvider={dataProvider}
                    notificationProvider={notificationProvider}
                    authProvider={authProvider}
                    resources={[
                      {
                        name: "businesses",
                        list: "/businesses",
                        create: "/businesses/create",
                        edit: "/businesses/edit/:id",
                        show: "/businesses/show/:id",
                        meta: {
                          canDelete: true,
                        },
                      },
                      {
                        name: "users",
                        list: "/users",
                        create: "/users/create",
                        edit: "/users/edit/:id",
                        show: "/users/show/:id",
                        meta: {
                          canDelete: true,
                        },
                      },
                      {
                        name: "employees",
                        list: "/employees",
                        create: "/employees/create",
                        edit: "/employees/edit/:id",
                        show: "/employees/show/:id",
                        meta: {
                          canDelete: true,
                        },
                      },
                    ]}
                    options={{
                      syncWithLocation: true,
                      warnWhenUnsavedChanges: true,
                      useNewQueryKeys: true,
                      projectId: "1DKFyx-f54Cln-N92uV2",
                    }}
                  >
                    {children}
                    <RefineKbar />
                  </Refine>
                  {/*</DevtoolsProvider>*/}
              </RefineSnackbarProvider>
            </ColorModeContextProvider>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
