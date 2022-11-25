import type { User, Record } from "@prisma/client";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { type LoaderFunction, redirect, json } from "@remix-run/server-runtime";
import Nav from "~/components/Nav";
import Sidebar from "~/components/Sidebar";
import { getRecordListItems } from "~/models/record.server";
import { getUser } from "~/session.server";

type LoaderData = {
  user: User;
  records?: Record[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) return redirect("/");
  const records = !user ? [] : await getRecordListItems({ userId: user.id });
  return json<LoaderData>({
    user: user ?? undefined,
    records,
  });
};

export default function Index() {
  const { user, records } = useLoaderData<LoaderData>();

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
