import { FullSlug, _stripSlashes, joinSegments, pathToRoot } from "../util/path"
import { JSResourceToScriptElement } from "../util/resources"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  function Head({ cfg, fileData, externalResources }: QuartzComponentProps) {
    const title = fileData.frontmatter?.title ?? "Untitled"
    const description = fileData.description?.trim() ?? "No description provided"
    const { css, js } = externalResources

    const appTitle = cfg.appTitle
    const attachedTitle = `${title} | ${appTitle}`
    const attachedDescription = `${description} | ${appTitle}`

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)

    const iconPath = joinSegments(baseDir, "static/icon.png")
    const ogImagePath = `https://${cfg.baseUrl}/static/og-image.png`
    const manifest = cfg.baseUrl == undefined ? "/manifest.json" : `https://${cfg.baseUrl}/manifest.json`

    const splashDir = joinSegments(baseDir, "static/splashScreens")
    const iphone5 = joinSegments(splashDir, "iphone5_splash.png")
    const iphone6 = joinSegments(splashDir, "iphone6_splash.png")
    const iphoneplus = joinSegments(splashDir, "iphoneplus_splash.png")
    const iphonex = joinSegments(splashDir, "iphonex_splash.png")
    const iphonexr = joinSegments(splashDir, "iphonexr_splash.png")
    const iphonexsmax = joinSegments(splashDir, "iphonexsmax_splash.png")
    const ipad = joinSegments(splashDir, "ipad_splash.png")
    const ipadpro1 = joinSegments(splashDir, "ipadpro1_splash.png")
    const ipadpro3 = joinSegments(splashDir, "ipadpro3_splash.png")
    const ipadpro2 = joinSegments(splashDir, "ipadpro2_splash.png")

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={attachedTitle} />
        <meta property="og:description" content={attachedDescription} />
        {cfg.baseUrl && <meta property="og:image" content={ogImagePath} />}
        <meta property="og:width" content="1200" />
        <meta property="og:height" content="675" />
        <meta name="theme-color" content="#faf8f8" />
        <link rel="apple-touch-icon" href={iconPath}></link>
        <link rel="icon" href={iconPath} />
        <link rel="manifest" href={manifest} />
        <meta name="description" content={attachedDescription} />
        <meta name="generator" content="Quartz" />
        <meta name="author" content="최완식(Choi WanSik)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={appTitle} />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link href={iphone5} media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href={iphone6} media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href={iphoneplus} media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
        <link href={iphonex} media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
        <link href={iphonexr} media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href={iphonexsmax} media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
        <link href={ipad} media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href={ipadpro1} media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href={ipadpro3} media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link href={ipadpro2} media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {css.map((href) => (
          <link key={href} href={href} rel="stylesheet" type="text/css" spa-preserve />
        ))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
