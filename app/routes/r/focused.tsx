import type { Record, User } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/server-runtime";
import { Button } from "~/components/Button";
import { getRecordListItems } from "~/models/record.server";
import { getUser } from "~/session.server";

type LoaderData = {
  user: User;
  records: Record[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) return redirect("/");
  const records = await getRecordListItems({ userId: user.id });
  return json<LoaderData>({ user, records });
};

export const FocusedPage = () => {
  const { user, records } = useLoaderData<LoaderData>();
  console.log("RECORDS: ", records);

  return (
    <div className="focused">
      {records.length > 0 ? (
        <>THERE ARE SOME RECORDS</>
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
