// eslint-disable-next-line prettier/prettier
import React from 'react';
// Import the original mapper
import { Icon } from "@iconify/react"; // Import the entire Iconify library.
import MDXComponents from "@theme-original/MDXComponents";

function Yes() {
  return <Icon icon="oi:check" height="33" color="green" />;
}

function No() {
  return <Icon icon="dashicons:no" height="45" color="red" />;
}

export default {
  // Re-use the default mapping
  ...MDXComponents,
  IIcon: Icon, // Make the iconify Icon component available in MDX as <icon />.
  Yes: Yes,
  No: No,
};
