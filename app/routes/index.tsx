import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="default-layout">
      No layout selected!
      <Link to="/focused" prefetch="render">
        Focused View
      </Link>
      <Link to="/week" prefetch="render">
        Week View
      </Link>
    </div>
  );
}
