import { QuartzEmitterPlugin } from "../types"
import { FilePath, FullSlug } from "../../util/path"
import { FullPageLayout } from "../../cfg"
import { sharedPageComponents } from "../../../quartz.layout"
import OfflineFallbackPage from "../../components/pages/OfflineFallbackPage"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { defaultProcessedContent } from "../vfile"
import { QuartzComponentProps } from "../../components/types"

export const Offline: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    pageBody: OfflineFallbackPage(),
    beforeBody: [],
    left: [],
    right: [],
  }

  const { head: Head, pageBody, footer: Footer } = opts
  const Body = BodyConstructor()

  return {
    name: "OfflineSupport",
    getQuartzComponents() {
      return [Head, Body, pageBody, Footer]
    },
    async emit({ cfg }, _content, resources, emit): Promise<FilePath[]> {
      const manifest = {
        short_name: cfg.configuration.pageTitle,
        name: cfg.configuration.pageTitle,
        description: cfg.configuration.description,
        background_color: cfg.configuration.theme.colors.lightMode.light,
        theme_color: cfg.configuration.theme.colors.lightMode.light,
        display: "minimal-ui",
        icons: [
          {
            src: "static/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "static/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "static/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "static/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          }
        ],
        start_url:
          cfg.configuration.baseUrl == undefined ? "/" : `https://${cfg.configuration.baseUrl}/`,
      }

      const serviceWorker =
        "importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');" +
        "const {pageCache, imageCache, staticResourceCache, googleFontsCache, offlineFallback} = workbox.recipes;" +
        "pageCache(); googleFontsCache(); staticResourceCache(); imageCache(); offlineFallback();"

      const slug = "offline" as FullSlug

      const url = new URL(`https://${cfg.configuration.baseUrl ?? "example.com"}`)
      const path = url.pathname as FullSlug
      const externalResources = pageResources(path, resources)
      const [tree, vfile] = defaultProcessedContent({
        slug,
        text: "Offline",
        description: "This page isn't offline available yet.",
        frontmatter: { title: "Offline", tags: [] },
      })

      const componentData: QuartzComponentProps = {
        fileData: vfile.data,
        externalResources,
        cfg: cfg.configuration,
        children: [],
        tree,
        allFiles: [],
      }

      return Promise.all([
        emit({
          content: JSON.stringify(manifest),
          slug: "manifest" as FullSlug,
          ext: ".json",
        }),
        emit({
          content: serviceWorker,
          slug: "sw" as FullSlug,
          ext: ".js",
        }),
        emit({
          content: renderPage(slug, componentData, opts, externalResources),
          slug,
          ext: ".html",
        }),
      ])
    },
  }
}