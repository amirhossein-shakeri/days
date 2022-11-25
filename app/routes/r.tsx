import type { User } from "@prisma/client";
import { Outlet, useLoaderData } from "@remix-run/react";
import { type LoaderFunction, redirect, json } from "@remix-run/server-runtime";
import Nav from "~/components/Nav";
import Sidebar from "~/components/Sidebar";
import { getUser } from "~/session.server";
import { Layout } from "../components/$layout";

type LoaderData = {
  user: User;
  // records?: Record[];
  layout?: Layout;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);
  if (!user) return redirect("/");
  const layout = params.layout as Layout;
  // invariant(layout, "Invalid Layout");
  // invariant(Object.values(Layout).includes(layout as Layout));
  // const records = !user ? [] : await getRecordListItems({ userId: user.id });
  return json<LoaderData>({
    user: user ?? undefined,
    // records,
    layout,
  });
};

export default function Index() {
  const { user, layout } = useLoaderData<LoaderData>();

  // URL schema: /$layout[today,planning,week,month,year]/$from[timeInterval]/$to[timeInterval]
  return (
    <div className="Home bg-indigo-50">
      <Nav active={layout} />
      <Sidebar />
      <div className="layout">
        <Outlet />
      </div>
    </div>
  );
}
