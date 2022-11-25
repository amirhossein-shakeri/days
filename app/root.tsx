import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { getUser } from "./session.server";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import appStylesUrl from "./styles/app.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: tailwindStylesheetUrl,
    },
    {
      rel: "stylesheet",
      href: appStylesUrl,
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Days",
  viewport: "width=device-width,initial-scale=1",
  "theme-color": "#6366f1",
});

export const loader: LoaderFunction = async ({ request }) =>
  json({
    user: await getUser(request),
  });

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
