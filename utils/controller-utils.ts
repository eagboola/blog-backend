import { type BlogEdits, type BlogEditProps } from "../types/blog.js";

export function extractBlogEditData(reqBody: any) {
  const edits: BlogEdits = {};
  const props: Array<BlogEditProps> = ["title", "content", "author"];

  // Use a `for... of` loop instead of incrementing counter -
  // TS cannot infer `prop` in counter-based iteration won't be `undefined`
  // and thus can't be used as a key to access `reqBody[prop]` without an error.
  for (const prop of props) {
    if (prop in reqBody && typeof reqBody[prop] === "string") {
      edits[prop] = reqBody[prop];
    }
  }

  return edits;

}

