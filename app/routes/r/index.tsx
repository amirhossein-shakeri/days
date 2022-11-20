import { Link } from "@remix-run/react";
import { useUser } from "~/utils";

export const RIndexPage = () => {
  const user = useUser();
  return (
    <div className="default-layout flex flex-col items-center justify-center gap-4">
      <p>Welcome {user.name ?? user.email}</p>
      <Link to="focused" prefetch="render">
        Focused View
      </Link>
      <Link to="week" prefetch="render">
        Week View
      </Link>
    </div>
  );
};

export default RIndexPage;
