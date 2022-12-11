import type { Record } from "@prisma/client";
import { calcDuration, formatDateTime } from "~/utils";

// https://github.com/amirhossein-shakeri/eagle-frontend/blob/main/src/styles/Record.module.scss

type Props = {
  data: Record;
  className?: string;
};

export const RecordCard = ({ data: r, className, ...props }: Props) => {
  /* Recover Dates */
  r.start = new Date(r.start ?? Date.now());
  r.end = new Date(r.end ?? Date.now());
  r.createdAt = new Date(r.createdAt ?? Date.now());
  r.updatedAt = new Date(r.updatedAt ?? Date.now());

  console.log("RECORD: ", r);
  const fStart = formatDateTime(r.start ?? new Date()); // formatted start
  const fEnd = formatDateTime(r.end ?? new Date());
  const duration = calcDuration(
    (r.start ? r.start.getTime() : Date.now()) -
      (r.end ? r.end.getTime() : Date.now())
  );
  const planned = r.type === "PLANNED";
  // const hasSimilar = r.similar?.length > 0;
  const hasSimilar = false;
  const styles = {};

  return (
    <div
      className={`/dark:bg-slate-800 /dark:hover:bg-neutral-800 rounded-md bg-slate-100 shadow-md hover:bg-neutral-200 ${className}`}
      {...props}
    >
      <div className="head">
        <span className="time">
          <span className="start" title={`Until ${fEnd}`}>
            {fStart}
          </span>
          {fEnd && <span className={styles.end}>{fEnd}</span>}
          {duration && <span className={`duration ${r.type}`}>{duration}</span>}
          {/* if ended, show the duration or idk always show duration but in
        another color */}
        </span>
        <h4 className="title" title={r.title}>
          {r.title}
        </h4>
        <div className="options">
          {r.description && (
            <span className="option" title={r.description}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </span>
          )}
          {/* If a planned record with the same title, show a time/clock icon with color if that is done */}
          {hasSimilar && (
            <span
              className={`option clock ${r.type}`}
              title={
                planned
                  ? "This plan is done! 🎉"
                  : "This record was planned! 👌🏻"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
          )}
          <button
            className="option hover:text-red-400"
            // onDoubleClick={handleDelete}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="details">
        <div className="description">{r.description}</div>
        {/* A check box to make it like a task which if checked, a new record will be created. */}
        <div className="times">
          Created At: {r.createdAt.toLocaleString()}
          Updated At: {r.updatedAt.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

// export const findSimilar = (obj: {}, filter: {}, arr: []) => {
//   const similar = [];
//   arr.forEach((i) =>
//     Object.keys(filter).forEach(
//       (key) => i[key] === obj[key] && i.id !== obj.id && similar.push(i)
//     )
//   );
//   return similar; // could be 2 array mappers :)
// };

export default RecordCard;
