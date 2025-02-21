import { FontWeight, SatoriOptions } from "satori/wasm"
import { GlobalConfiguration } from "../cfg"
import { QuartzPluginData } from "../plugins/vfile"
import { JSXInternal } from "preact/src/jsx"
import { ThemeKey } from "./theme"

/**
 * Get an array of `FontOptions` (for satori) given google font names
 * @param headerFontName name of google font used for header
 * @param bodyFontName name of google font used for body
 * @returns FontOptions for header and body
 */
export async function getSatoriFont(headerFontName: string, bodyFontName: string) {
  const headerWeight = 700 as FontWeight
  const bodyWeight = 400 as FontWeight

  // Fetch fonts
  const headerFont = await fetchTtf(headerFontName, headerWeight)
  const bodyFont = await fetchTtf(bodyFontName, bodyWeight)

  // Convert fonts to satori font format and return
  const fonts: SatoriOptions["fonts"] = [
    { name: headerFontName, data: headerFont, weight: headerWeight, style: "normal" },
    { name: bodyFontName, data: bodyFont, weight: bodyWeight, style: "normal" },
  ]
  return fonts
}

/**
 * Get the `.ttf` file of a google font
 * @param fontName name of google font
 * @param weight what font weight to fetch font
 * @returns `.ttf` file of google font
 */
async function fetchTtf(fontName: string, weight: FontWeight): Promise<ArrayBuffer> {
  try {
    // Get css file from google fonts
    const cssResponse = await fetch(
      `https://fonts.googleapis.com/css2?family=${fontName}:wght@${weight}`,
    )
    const css = await cssResponse.text()

    // Extract .ttf url from css file
    const urlRegex = /url\((https:\/\/fonts.gstatic.com\/s\/.*?.ttf)\)/g
    const match = urlRegex.exec(css)

    if (!match) {
      throw new Error("Could not fetch font")
    }

    // Retrieve font data as ArrayBuffer
    const fontResponse = await fetch(match[1])

    // fontData is an ArrayBuffer containing the .ttf file data (get match[1] due to google fonts response format, always contains link twice, but second entry is the "raw" link)
    const fontData = await fontResponse.arrayBuffer()

    return fontData
  } catch (error) {
    throw new Error(`Error fetching font: ${error}`)
  }
}

export type SocialImageOptions = {
  /**
   * What color scheme to use for image generation (uses colors from config theme)
   */
  colorScheme: ThemeKey
  /**
   * Height to generate image with in pixels (should be around 630px)
   */
  height: number
  /**
   * Width to generate image with in pixels (should be around 1200px)
   */
  width: number
  /**
   * Whether to use the auto generated image for the root path ("/", when set to false) or the default og image (when set to true).
   */
  excludeRoot: boolean
  /**
   * JSX to use for generating image. See satori docs for more info (https://github.com/vercel/satori)
   * @param cfg global quartz config
   * @param userOpts options that can be set by user
   * @param title title of current page
   * @param description description of current page
   * @param fonts global font that can be used for styling
   * @param fileData full fileData of current page
   * @returns prepared jsx to be used for generating image
   */
  imageStructure: (
    cfg: GlobalConfiguration,
    userOpts: UserOpts,
    title: string,
    description: string,
    fonts: SatoriOptions["fonts"],
    fileData: QuartzPluginData,
  ) => JSXInternal.Element
}

export type UserOpts = Omit<SocialImageOptions, "imageStructure">

export type ImageOptions = {
  /**
   * what title to use as header in image
   */
  title: string
  /**
   * what description to use as body in image
   */
  description: string
  /**
   * what fileName to use when writing to disk
   */
  fileName: string
  /**
   * what directory to store image in
   */
  fileDir: string
  /**
   * what file extension to use (should be `webp` unless you also change sharp conversion)
   */
  fileExt: string
  /**
   * header + body font to be used when generating satori image (as promise to work around sync in component)
   */
  fontsPromise: Promise<SatoriOptions["fonts"]>
  /**
   * `GlobalConfiguration` of quartz (used for theme/typography)
   */
  cfg: GlobalConfiguration
  /**
   * full file data of current page
   */
  fileData: QuartzPluginData
}

// This is the default template for generated social image.
export const defaultImage: SocialImageOptions["imageStructure"] = (
  cfg: GlobalConfiguration,
  { colorScheme }: UserOpts,
  title: string,
  description: string,
  fonts: SatoriOptions["fonts"],
  _fileData: QuartzPluginData,
) => {
  // How many characters are allowed before switching to smaller font
  const fontBreakPoint = 22
  const useSmallerFont = title.length > fontBreakPoint

  // Setup to access image
  const iconPath = `https://${cfg.baseUrl}/static/icon.png`
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        backgroundColor: cfg.theme.colors[colorScheme].light,
        gap: "2rem",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
        paddingLeft: "5rem",
        paddingRight: "5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          flexDirection: "row",
          gap: "2.5rem",
        }}
      >
        <img src={iconPath} width={135} height={135} />
        <p
          style={{
            color: cfg.theme.colors[colorScheme].dark,
            fontSize: useSmallerFont ? 70 : 82,
            fontFamily: fonts[0].name,
          }}
        >
          {title}
        </p>
      </div>
      <p
        style={{
          color: cfg.theme.colors[colorScheme].dark,
          fontSize: 44,
          lineClamp: 3,
          fontFamily: fonts[1].name,
        }}
      >
        {description}
      </p>
    </div>
  )
}
