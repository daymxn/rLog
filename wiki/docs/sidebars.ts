import { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: ["quick-start", "fast-breakdown", "faq"],
    },
    {
      type: "category",
      label: "Guides",
      link: {
        type: "generated-index",
        title: "rLog Guides",
        description: "Learn about the basics of rLog.",
        keywords: ["guides"],
      },
      items: [
        "basics/log-entries",
        "basics/log-levels",
        "basics/tags",
        "basics/default-instance",
        "basics/serialization",
        "basics/enrichers",
        "basics/sinks",
        "basics/log-context",
      ],
    },
    {
      type: "category",
      label: "Advanced Guides",
      link: {
        type: "generated-index",
        title: "rLog Advanced Guides",
        description: "Continue your learning journey with more advanced topics.",
        keywords: ["guides", "advanced-guides"],
      },
      items: ["advanced/source-metadata", "advanced/roblox-console-configuration", "advanced/google-cloud-logging"],
    },
  ],
};

export default sidebars;
