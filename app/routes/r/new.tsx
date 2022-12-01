import type { Tag, User } from "@prisma/client";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import {
  type ActionFunction,
  json,
  type LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { type ChangeEvent, type ReactNode, useEffect, useState } from "react";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";
import { _2digit } from "~/utils";
import { Button } from "~/components/Button";

export const LAST_DATE_KEY = "create-record-date";
export const DEFAULT_STATUS = <span className="text-emerald-500">✔ Ready</span>;

type LoaderData = {
  user: User;
  tags: Tag[];
};

type ActionData = {
  values: {
    title: string;
    start: string;
    end: string;
  };
  errors: {
    title?: string | boolean;
    start?: string | boolean;
    end?: string | boolean;
  };
};

type StateData = {
  /* Record Types */
  title: string;
  type: "HAPPENED" | "PLANNED";
  start?: number; // Date
  end?: number; // Date
  description: string;
  // userId: string;
  tags?: object[];

  /* Utility Types */
  date: number;
  startString: string; //? Can I remove it?
  endString: string; //? Could I remove it?
  tagsString: string;
  status: ReactNode;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const tags = await prisma.tag.findMany({ where: { userId: user.id } });
  return json<LoaderData>({ user, tags });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const data = {
    title: form.get("title"),
    type: form.get("type"),
    start: form.get("start"),
    end: form.get("end"),
    description: form.get("description"),
    tags: form.get("tags"),
  };
  const errors: ActionData["errors"] = {
    title: !data.title && "Title is required",
    start: !data.start && "Start is invalid",
    end: !data.end && "Invalid end",
  };
  return redirect("/r");
};

export const NewRecordPage = () => {
  const { user } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const lastDate =
    typeof window !== "undefined" && localStorage.getItem(LAST_DATE_KEY);
  const targetDate = lastDate ? new Date(lastDate) : new Date();

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
  }, []);

  const [availTags, setAvailTags] = useState([]);
  const [data, setData] = useState<StateData>({
    title: actionData?.values.title ?? "",
    startString: "",
    endString: "",
    type: "HAPPENED",
    description: "",
    tagsString: "",
    date: targetDate.getTime(),
    status: DEFAULT_STATUS,
  });

  const updateDate = (e: ChangeEvent<HTMLInputElement>) => {
    // also update start & end
    setData((p) => {
      const oldStart = new Date(p.start ?? p.date); //? Always have value?
      const oldEnd = new Date(p.end ?? p.date); //? Always have value?
      const start = new Date(e.target.valueAsNumber);
      const end = new Date(e.target.valueAsNumber);
      start.setHours(
        oldStart.getHours(),
        oldStart.getMinutes(),
        oldStart.getSeconds()
      );
      end.setHours(oldEnd.getHours(), oldEnd.getMinutes(), oldEnd.getSeconds());
      return {
        ...p,
        start: start.getTime(),
        end: end.getTime(),
        date: e.target.valueAsNumber,
        // dateAsString: e.target.value, //? Remove?
      };
    });

    if (typeof window !== "undefined")
      localStorage.setItem(LAST_DATE_KEY, e.target.valueAsNumber.toString());
  };

  const updateStart = (e: ChangeEvent<HTMLInputElement>) => {
    setData((p) => ({ ...p, startString: e.target.value }));
    const match = e.target.value.match(/\d{1,2}(:\d{1,2})?/);
    if (!match) return console.log("invalid start");
    const startValue = match[0];
    const start = new Date(data.date);
    const parsed = startValue.split(":");
    if (parsed.length < 1) return console.log("start not ok");
    start.setHours(parseInt(parsed[0]), parseInt(parsed[1]) || 0, 0);
    setData((p) => ({ ...p, start: start.getTime() }));
  };

  const updateEnd = (e: ChangeEvent<HTMLInputElement>) => {
    setData((p) => ({ ...p, endString: e.target.value }));
    const match = e.target.value.match(/\d{1,2}(:\d{1,2})?/);
    if (!match) return console.log("invalid end");
    const endValue = match[0];
    const end = new Date(data.date);
    const parsed = endValue.split(":");
    if (parsed.length < 1) return console.log("end not ok");
    end.setHours(parseInt(parsed[0]), parseInt(parsed[1]) || 0, 0);
    setData((p) => ({ ...p, end: end.getTime() }));
  };

  const updateTags = (e: ChangeEvent<HTMLInputElement>) =>
    setData((p) => ({
      ...p,
      tagsString: e.target.value,
      tags: parseTags(e.target.value),
    }));

  useEffect(() => {
    if (data.end || data.start)
      setData((p) => ({
        ...p,
        type:
          // we use Date.now() to remove the effect of the missing
          // condition if data.start or data.end is missing. IQ😎 bro!
          new Date(data.start ?? Date.now()) > new Date() ||
          new Date(data.end ?? Date.now()) > new Date()
            ? "PLANNED"
            : "HAPPENED",
      }));
  }, [data.end, data.start]);

  const planning = data.type === "PLANNED";
  const dateAsString = [
    targetDate.getFullYear(),
    _2digit(targetDate.getMonth() + 1), // getMonth starts from 0
    _2digit(targetDate.getDate()), // getDay is the day of the week
  ].join("-");

  return (
    <div>
      <div className="create-record flex h-screen w-full flex-col items-center justify-center border sm:p-2">
        <Form
          method="post"
          className="flex w-full flex-col gap-2 rounded-lg border-slate-200 bg-white px-3 py-2 shadow-lg sm:h-auto sm:w-auto sm:rounded-xl sm:border sm:p-4"
        >
          <h1 className="title text-center text-lg font-semibold">
            {planning ? "Plan " : "Create "}
            New Record
          </h1>
          <div className="inputs my-4 flex flex-col gap-2">
            <input
              type="text"
              name="title"
              id="inputTitle"
              autoFocus
              autoComplete="on"
              className={`${inputClassNames}`}
              placeholder="Title"
              value={data.title}
              onChange={(e) =>
                setData((p) => ({ ...p, title: e.target.value }))
              }
            />
            <input
              type="text"
              name="start"
              id="inputStart"
              className={`${inputClassNames} font-mono`}
              value={data.startString}
              placeholder="04:03 start"
              onChange={updateStart}
            />
            <input
              type="text"
              name="end"
              id="inputEnd"
              className={`${inputClassNames} font-mono`}
              value={data.endString}
              placeholder="04:24 end"
              onChange={updateEnd}
            />
          </div>
          <Button className="">Create {planning && " Planned "} Record</Button>
          <span className="status text-center">{data.status}</span>
          <div className="inputs mb-4 flex flex-col gap-2">
            <input
              type="date"
              name="date"
              id="inputDate"
              className={`${inputClassNames} font-mono`}
              placeholder="date"
              value={dateAsString}
              onChange={updateDate}
            />
            <textarea
              name="description"
              id="inputDescription"
              rows={3}
              className={`${inputClassNames}`}
              placeholder="Description ..."
              onChange={(e) =>
                setData((p) => ({ ...p, description: e.target.value }))
              }
              value={data.description}
            ></textarea>

            <div className="tags flex flex-row flex-wrap gap-1">
              {data.tags?.map(
                (t) =>
                  // <Tag key={t.id} {...t} />
                  "TAG"
                // <span className="tag bg-slate-300 dark:bg-slate-600 shadow-md rounded px-1 text-xs"
                //   onClick={() => { removeTag(t); syncTagsString() }}>
                //   {t.title}
                // </span>
              )}
            </div>

            <input
              type="text"
              name="tag"
              id="inputTag"
              className={`${inputClassNames} font-mono`}
              value={data.tagsString}
              placeholder="a, grow, ..."
              onChange={updateTags}
              // onKeyUp={updateTags}
            />
            {/* <ReactTags /> */}
          </div>
          <span className="time text-center font-mono text-green-500">
            {`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`}
          </span>
          <Link to="/r" className="text-center text-blue-400">
            HOME
          </Link>
        </Form>
      </div>
    </div>
  );
};

export const validateTime = (input: string) => {
  const match = input.match(/\d{1,2}:\d{1,2}/);
  if (!match) return console.log("invalid start");
};

export const parseTags = (rawTagsStr: string) =>
  rawTagsStr.split(",").map((t) => ({ title: t.trim() }));

export const refineTags = (rawTags: string) => {
  const tags = parseTags(rawTags);
  if (!tags[tags.length - 1].title) tags.pop();
  return tags;
};

export const inputClassNames = `border border-slate-300 shadow-inner w-full rounded-md py-0.5 px-1 bg-slate-100 font-medium`;

export default NewRecordPage;
