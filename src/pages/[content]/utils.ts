import * as clazz from "~/database/actions/class";
import * as batch from "~/database/actions/batch";

export const contents = {
  classes: clazz,
  batches: batch,
};

export const contentKeys = Object.keys(contents);
