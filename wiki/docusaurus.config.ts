/* eslint-disable roblox-ts/no-regex */
import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "rLog",
  tagline: "Context based Server-Side logging for ROBLOX.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
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
          // async sidebarItemsGenerator({ defaultSidebarItemsGenerator, ...args }) {
          //   const sidebarItems = await defaultSidebarItemsGenerator(args);

          //   function attachCategoryLink(items) {
          //     items.forEach((item) => {
          //       if (item.type === "category" && item.items) {
          //         const matchingDocIndex = items.findIndex(
          //           (subItem) => subItem.type === "doc" && subItem.id.endsWith(`${item.label}`)
          //         );
          //         if (matchingDocIndex !== -1) {
          //           const matchingDoc = items[matchingDocIndex];
          //           console.log(matchingDoc);
          //           item.link = {
          //             type: "doc",
          //             id: matchingDoc.id,
          //           };
          //           items.splice(matchingDocIndex, 1);
          //         }
          //         attachCategoryLink(item.items);
          //       }
          //     });
          //   }

          //   attachCategoryLink(sidebarItems);
          //   return sidebarItems;
          // },
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
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
              to: "/docs/",
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
      additionalLanguages: ["bash", "typescript", "lua", "powershell", "toml"],
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
        {
          className: "theme-info-highlighted-line",
          line: "info-next-line",
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
