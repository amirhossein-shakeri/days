import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import { ReactNode } from "react";

export enum Layout {
  FOCUSED = "focused",
  WEEK = "week",
  MONTH = "month",
}

type LoaderData = {
  layout: Layout;
};

export const loader: LoaderFunction = ({ request, params }) => {
  const layout = params.layout as Layout;
  return json<LoaderData>({ layout });
};

export const LayoutPage = () => {
  const { layout } = useLoaderData<LoaderData>();
  let layoutComponent: ReactNode = (
    <div className="not-found">LAYOUT NOT FOUND!</div>
  );

  switch (layout) {
    case Layout.FOCUSED:
      layoutComponent = "FOCUSED LAYOUT";
      break;

    case Layout.WEEK:
      layoutComponent = "WEEK LAYOUT";
      break;

    case Layout.MONTH:
      layoutComponent = "MONTH LAYOUT";
      break;

    default:
      break;
  }
  return <div className="layout">{layoutComponent}</div>;
};

export default LayoutPage;
