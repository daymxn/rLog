/* eslint-disable roblox-ts/no-regex */
import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "rLog",
  tagline: "Context-based server-side logging for ROBLOX.",
  favicon: "img/favicon.ico",
  url: "https://rlog.daymxn.com",
  baseUrl: "/",
  organizationName: "daymxn",
  projectName: "rLog",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
    },
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./docs/sidebars.ts",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/social-card.jpg",
    sidebar: {
      hideable: true,
    },
    navbar: {
      title: "rLog",
      logo: {
        alt: "rLog logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "Learn",
        },
        {
          to: "/docs/api",
          label: "API",
          position: "left",
        },
        {
          href: "https://github.com/daymxn/rlog",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Learn",
          items: [
            {
              label: "Quick Start",
              to: "/docs/quick-start",
            },
            {
              label: "Fast Breakdown",
              to: "/docs/fast-breakdown",
            },
            {
              label: "Guides",
              to: "/docs/category/guides",
            },
            {
              label: "FAQ",
              to: "/docs/faq",
            },
          ],
        },
        {
          title: "API Reference",
          items: [
            {
              label: "rLog API",
              to: "/docs/api",
            },
          ],
        },
        {
          title: "Community Discords",
          items: [
            {
              label: "roblox-ts",
              href: "https://discord.roblox-ts.com/",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/daymxn/rLog",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Daymon LR`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ["bash", "typescript", "toml"],
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
        {
          className: "code-block-error-line",
          line: "error-next-line",
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
