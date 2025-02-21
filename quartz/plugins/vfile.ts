import { Root as HtmlRoot } from "hast"
import { Root as MdRoot } from "mdast"
import { Data, VFile } from "vfile"

export type QuartzPluginData = Data
export type MarkdownContent = [MdRoot, VFile]
export type ProcessedContent = [HtmlRoot, VFile]

export function defaultProcessedContent(vfileData: Partial<QuartzPluginData>): ProcessedContent {
  const root: HtmlRoot = { type: "root", children: [] }
  const vfile = new VFile("")
  vfile.data = vfileData
  return [root, vfile]
}
