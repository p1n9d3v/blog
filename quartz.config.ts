import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "p1n9d3v",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    // baseUrl: "quartz.jzhao.xyz",
    baseUrl: "blog.p1n9d3v.com",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    generateSocialImages: false,
    theme: {
      // fontOrigin: "googleFonts",
      // cdnCaching: true,
      // typography: {
      //   header: "Schibsted Grotesk",
      //   body: "Source Sans Pro",
      //   code: "IBM Plex Mono",
      // },
      fontOrigin: "local",
      cdnCaching: true,
      typography: {
        header: "dm",
        body: "dm",
        code: "dm",
      },
      colors: {
        // lightMode: {
        //   light: "#faf8f8",
        //   lightgray: "#e5e5e5",
        //   gray: "#b8b8b8",
        //   darkgray: "#4e4e4e",
        //   dark: "#2b2b2b",
        //   secondary: "#284b63",
        //   tertiary: "#84a59d",
        //   highlight: "rgba(143, 159, 169, 0.15)",
        //   textHighlight: "#fff23688",
        // },
        lightMode: {
          light: "#090319",
          // light: "#1B2636",
          // lightgray: "#393639",
          lightgray: "#AC2ACC",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          // secondary: "#7b97aa",
          secondary: "#C678DD",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
        darkMode: {
          light: "#090319",
          // light: "#1B2636",
          // lightgray: "#393639",
          lightgray: "#AC2ACC",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          // secondary: "#7b97aa",
          secondary: "#C678DD",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "one-dark-pro",
          dark: "one-dark-pro",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
