import type { Record, User } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { Button } from "~/components/Button";
import RecordCard from "~/components/Record";
import { prisma } from "~/db.server";
import { getRecordListItems } from "~/models/record.server";
import { getUser } from "~/session.server";

type LoaderData = {
  user: User;
  records: {
    today: Record[];
    tomorrow: Record[];
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) return redirect("/");
  const lastNight = new Date();
  lastNight.setHours(0, 0, 0, 0);
  const tonight = new Date(lastNight);
  console.log("1", lastNight, tonight);
  tonight.setDate(lastNight.getDate() + 1);
  console.log("2", lastNight, tonight);
  const tomorrowNight = new Date(tonight);
  tomorrowNight.setDate(tonight.getDate() + 1);
  console.log("3", tonight, tomorrowNight);
  const today = await prisma.record.findMany({
    where: { userId: user.id, start: { gte: lastNight, lte: tonight } },
  });
  const tomorrow = await prisma.record.findMany({
    where: { userId: user.id, start: { gte: tonight, lte: tomorrowNight } },
  });
  // console.log("PRISMA: ", today, tomorrow, lastNight, tonight, tomorrowNight);
  return json<LoaderData>({
    user,
    records: { today, tomorrow },
  });
};

export const FocusedPage = () => {
  const { user, records } = useLoaderData<LoaderData>();
  // console.log("RECORDS: ", records);

  return (
    <div className="focused flex h-full flex-col items-stretch gap-4 px-1 py-4 sm:flex-row sm:justify-center">
      {records.today.length > 0 ? (
        <>
          <div className="Records flex flex-col items-stretch gap-2 sm:max-w-[320px]">
            {records.today.map((r) => (
              <RecordCard key={r.id} data={r} />
            ))}
            <Link to="../new">
              <Button className="w-full bg-indigo-500">Add New Record</Button>
            </Link>
          </div>
          <div className="Records flex flex-col items-stretch gap-2 sm:max-w-[320px]">
            {records.tomorrow.map((r) => (
              <RecordCard key={r.id} data={r} />
            ))}
            <Link to="../new">
              <Button className="w-full bg-indigo-500">Add New Record</Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="no-records">
          No records yet.{" "}
          <Link to="/r/new">
            <Button className="btn">Add first one!</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FocusedPage;
