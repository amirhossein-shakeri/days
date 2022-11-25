import { Tag, User } from "@prisma/client";
import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";
import { _2digit } from "~/utils";

export const LAST_DATE_KEY = "create-record-date";
export const DEFAULT_STATUS = <span className="text-emerald-500">✔ Ready</span>;

type LoaderData = {
  user: User;
  tags: Tag[];
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
  return redirect("/r");
};

export const NewRecordPage = () => {
  const { user } = useLoaderData<LoaderData>();

  const lastDate =
    typeof window !== "undefined" && localStorage.getItem(LAST_DATE_KEY);
  const targetDate = lastDate ? new Date(lastDate) : new Date();

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
  }, []);

  const [availTags, setAvailTags] = useState([]);
  const [data, setData] = useState<StateData>({
    title: "",
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
      <div className="create-record">
        <Form method="post" className="create-record-form">
          <h1 className="title">
            {planning ? "Plan " : "Create "}
            New Record
          </h1>
          <div className="inputs">
            <input
              type="text"
              name="title"
              id="inputTitle"
              autoFocus
              autoComplete="on"
              className="dark-input"
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
              className="dark-input font-mono"
              value={data.startString}
              placeholder="04:03 start"
              onChange={updateStart}
            />
            <input
              type="text"
              name="end"
              id="inputEnd"
              className="dark-input font-mono"
              value={data.endString}
              placeholder="04:24 end"
              onChange={updateEnd}
            />
          </div>
          <button className="btn BtnCreate">
            Create
            {planning && " Planned "}
            Record
          </button>
          <span className="status">{data.status}</span>
          <div className="inputs">
            <input
              type="date"
              name="date"
              id="inputDate"
              className="dark-input font-mono"
              placeholder="date"
              value={dateAsString}
              onChange={updateDate}
            />
            <textarea
              name="description"
              id="inputDescription"
              rows={3}
              className="dark-input"
              placeholder="Description ..."
              onChange={(e) =>
                setData((p) => ({ ...p, description: e.target.value }))
              }
              value={data.description}
            ></textarea>

            <div className="tags">
              {data.tags?.map(
                (t) =>
                  // <Tag key={t.id} {...t} />
                  "TAG"
                // <span className="tag"
                //   onClick={() => { removeTag(t); syncTagsString() }}>
                //   {t.title}
                // </span>
              )}
            </div>

            <input
              type="text"
              name="tag"
              id="inputTag"
              className="dark-input font-mono"
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
          <Link to="/r">
            <a className="text-center text-blue-400">HOME</a>
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

export default NewRecordPage;
