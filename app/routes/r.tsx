import type { User, Record } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import { type LoaderFunction, redirect, json } from "@remix-run/server-runtime";
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
  if (!user) return redirect("/guest");
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
    <div className="Home">
      <Nav />
      <Sidebar />
      <div className="layout">
        <div className="default-layout">
          No layout selected!
          <Link to="/focused" prefetch="render">
            Focused View
          </Link>
          <Link to="/week" prefetch="render">
            Week View
          </Link>
        </div>
      </div>
    </div>
  );
}
