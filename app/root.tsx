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
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import type { User, Record } from "@prisma/client";
import { GuestHero } from "./components/GuestHero";
import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";
import { getRecordListItems } from "./models/record.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Days",
  viewport: "width=device-width,initial-scale=1",
  "theme-color": "#6366f1",
});

type LoaderData = {
  user?: User;
  records?: Record[];
  layout: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);
  const layout = params.layout ?? "focus";
  console.log("USER: ", user);
  const records = !user ? [] : await getRecordListItems({ userId: user.id });
  return json<LoaderData>({
    user: user ?? undefined,
    records,
    layout,
  });
};

export default function App() {
  const { user, records, layout } = useLoaderData<LoaderData>();
  console.log("RECORDS", records);

  if (!user) return <GuestHero />;

  // URL schema: /$layout[today,planning,week,month,year]/$from[timeInterval]/$to[timeInterval]

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="Home">
          <Nav />
          <Sidebar />
          <div className="layout">
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
