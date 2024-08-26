import { Icon } from "@iconify/react";
import MDXComponents from "@theme-original/MDXComponents";
import React from "react";

function Yes() {
  return <Icon icon="oi:check" height="33" color="green" />;
}

function No() {
  return <Icon icon="dashicons:no" height="45" color="red" />;
}

export default {
  ...MDXComponents,
  IIcon: Icon,
  Yes: Yes,
  No: No,
};
