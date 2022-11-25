import { Link } from "@remix-run/react";
import { Layout } from "~/components/$layout";
import { MIcon } from "./MIcon";

type Props = {
  active?: Layout;
};

const navLinks = [
  { key: "week", link: "/r/week", icon: <MIcon>view_week</MIcon> },
  { key: "focused", link: "/r/focused", icon: <MIcon>view_column_2</MIcon> },
  { key: "month", link: "/r/month", icon: <MIcon>calendar_view_month</MIcon> },
];

export const Nav = ({ active }: Props) => (
  <div className="Nav flex flex-row items-center justify-center rounded-b-2xl bg-white py-1 px-2 shadow-md">
    <ul className="views flex flex-row items-center justify-center gap-3 text-indigo-500">
      {navLinks.map((i) => (
        <Link
          key={i.link}
          to={i.link}
          prefetch="intent"
          className={`flex rounded-lg bg-indigo-50 p-1 shadow-sm transition-all hover:bg-indigo-500 hover:text-white hover:shadow-md ${
            active == i.key ? "bg-indigo-500 text-white shadow-md" : ""
          }`}
        >
          {i.icon}
        </Link>
      ))}
    </ul>
  </div>
);

export default Nav;
