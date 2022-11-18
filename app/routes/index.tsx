import { Link } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { GuestHero } from "~/components/GuestHero";
import { requireUser } from "~/session.server";

import { useOptionalUser } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  // const user = await requireUser(request);
  return null;
};

export default function Index() {
  const user = useOptionalUser();
  if (!user) return <GuestHero />;
  return "fff";
}
