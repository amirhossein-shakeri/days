import { Link } from "@remix-run/react";
import { MIcon } from "./MIcon";

export const Nav = () => (
  <div className="Nav flex flex-row items-center justify-center rounded-b-2xl bg-white py-1 px-2 shadow-md">
    <ul className="views flex flex-row items-center justify-center gap-3 text-indigo-500">
      <Link
        to="/r/week"
        prefetch="intent"
        className="flex rounded-lg bg-indigo-50 p-1 shadow-sm transition-all hover:bg-indigo-500 hover:text-white hover:shadow-md"
      >
        <MIcon>view_week</MIcon>
      </Link>
      <Link
        to="/r/focused"
        prefetch="intent"
        className="flex rounded-lg bg-indigo-50 p-1 shadow-sm transition-all hover:bg-indigo-500 hover:text-white hover:shadow-md"
      >
        <MIcon>view_column_2</MIcon>
      </Link>
      <Link
        to="/r/month"
        prefetch="intent"
        className="flex rounded-lg bg-indigo-50 p-1 shadow-sm transition-all hover:bg-indigo-500 hover:text-white hover:shadow-md"
      >
        <MIcon>calendar_view_month</MIcon>
      </Link>
    </ul>
  </div>
);

export default Nav;
