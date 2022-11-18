import type { Record, User } from "@prisma/client";
import { Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import { GuestHero } from "~/components/GuestHero";
import Nav from "~/components/Nav";
import Sidebar from "~/components/Sidebar";
import { getRecordListItems } from "~/models/record.server";
import { getUser } from "~/session.server";

type LoaderData = {
  user?: User;
  records?: Record[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  console.log("USER: ", user);
  const records = !user ? [] : await getRecordListItems({ userId: user.id });
  return json<LoaderData>({ user: user ?? undefined, records });
};

export default function Index() {
  const { user, records } = useLoaderData<LoaderData>();
  const layout = "focus";
  console.log("RECORDS", records);

  if (!user) return <GuestHero />;

  // URL schema: /$layout[today,planning,week,month,year]/$from[timeInterval]/$to[timeInterval]
  return (
    <div className="Home">
      <Nav />
      <Sidebar />
      <div className="layout">
        <Outlet />
      </div>
    </div>
  );
}
