import { removeAllChildren } from "./util"

interface Position {
  x: number
  y: number
}

class DiagramPanZoom {
  private isDragging = false
  private startPan: Position = { x: 0, y: 0 }
  private currentPan: Position = { x: 0, y: 0 }
  private scale = 1
  private readonly MIN_SCALE = 0.5
  private readonly MAX_SCALE = 3
  private readonly ZOOM_SENSITIVITY = 0.001

  constructor(
    private container: HTMLElement,
    private content: HTMLElement,
  ) {
    this.setupEventListeners()
    this.setupNavigationControls()
  }

  private setupEventListeners() {
    // Mouse drag events
    this.container.addEventListener("mousedown", this.onMouseDown.bind(this))
    document.addEventListener("mousemove", this.onMouseMove.bind(this))
    document.addEventListener("mouseup", this.onMouseUp.bind(this))

    // Wheel zoom events
    this.container.addEventListener("wheel", this.onWheel.bind(this), { passive: false })

    // Reset on window resize
    window.addEventListener("resize", this.resetTransform.bind(this))
  }

  private setupNavigationControls() {
    const controls = document.createElement("div")
    controls.className = "mermaid-controls"

    // Zoom controls
    const zoomIn = this.createButton("+", () => this.zoom(0.1))
    const zoomOut = this.createButton("-", () => this.zoom(-0.1))
    const resetBtn = this.createButton("Reset", () => this.resetTransform())

    controls.appendChild(zoomOut)
    controls.appendChild(resetBtn)
    controls.appendChild(zoomIn)

    this.container.appendChild(controls)
  }

  private createButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement("button")
    button.textContent = text
    button.className = "mermaid-control-button"
    button.addEventListener("click", onClick)
    window.addCleanup(() => button.removeEventListener("click", onClick))
    return button
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return // Only handle left click
    this.isDragging = true
    this.startPan = { x: e.clientX - this.currentPan.x, y: e.clientY - this.currentPan.y }
    this.container.style.cursor = "grabbing"
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return
    e.preventDefault()

    this.currentPan = {
      x: e.clientX - this.startPan.x,
      y: e.clientY - this.startPan.y,
    }

    this.updateTransform()
  }

  private onMouseUp() {
    this.isDragging = false
    this.container.style.cursor = "grab"
  }

  private onWheel(e: WheelEvent) {
    e.preventDefault()

    const delta = -e.deltaY * this.ZOOM_SENSITIVITY
    const newScale = Math.min(Math.max(this.scale + delta, this.MIN_SCALE), this.MAX_SCALE)

    // Calculate mouse position relative to content
    const rect = this.content.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Adjust pan to zoom around mouse position
    const scaleDiff = newScale - this.scale
    this.currentPan.x -= mouseX * scaleDiff
    this.currentPan.y -= mouseY * scaleDiff

    this.scale = newScale
    this.updateTransform()
  }

  private zoom(delta: number) {
    const newScale = Math.min(Math.max(this.scale + delta, this.MIN_SCALE), this.MAX_SCALE)

    // Zoom around center
    const rect = this.content.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const scaleDiff = newScale - this.scale
    this.currentPan.x -= centerX * scaleDiff
    this.currentPan.y -= centerY * scaleDiff

    this.scale = newScale
    this.updateTransform()
  }

  private updateTransform() {
    this.content.style.transform = `translate(${this.currentPan.x}px, ${this.currentPan.y}px) scale(${this.scale})`
  }

  private resetTransform() {
    this.scale = 1
    this.currentPan = { x: 0, y: 0 }
    this.updateTransform()
  }
}

const cssVars = [
  "--secondary",
  "--tertiary",
  "--gray",
  "--light",
  "--lightgray",
  "--highlight",
  "--dark",
  "--darkgray",
  "--codeFont",
] as const

let mermaidImport = undefined
document.addEventListener("nav", async () => {
  const center = document.querySelector(".center") as HTMLElement
  const nodes = center.querySelectorAll("code.mermaid") as NodeListOf<HTMLElement>
  if (nodes.length === 0) return

  const computedStyleMap = cssVars.reduce(
    (acc, key) => {
      acc[key] = getComputedStyle(document.documentElement).getPropertyValue(key)
      return acc
    },
    {} as Record<(typeof cssVars)[number], string>,
  )

  mermaidImport ||= await import(
    //@ts-ignore
    "https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.0/mermaid.esm.min.mjs"
  )
  const mermaid = mermaidImport.default

  const darkMode = document.documentElement.getAttribute("saved-theme") === "dark"
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: darkMode ? "dark" : "base",
    themeVariables: {
      fontFamily: computedStyleMap["--codeFont"],
      primaryColor: computedStyleMap["--light"],
      primaryTextColor: computedStyleMap["--darkgray"],
      primaryBorderColor: computedStyleMap["--tertiary"],
      lineColor: computedStyleMap["--darkgray"],
      secondaryColor: computedStyleMap["--secondary"],
      tertiaryColor: computedStyleMap["--tertiary"],
      clusterBkg: computedStyleMap["--light"],
      edgeLabelBackground: computedStyleMap["--highlight"],
    },
  })
  await mermaid.run({ nodes })

  for (let i = 0; i < nodes.length; i++) {
    const codeBlock = nodes[i] as HTMLElement
    const pre = codeBlock.parentElement as HTMLPreElement
    const clipboardBtn = pre.querySelector(".clipboard-button") as HTMLButtonElement
    const expandBtn = pre.querySelector(".expand-button") as HTMLButtonElement

    const clipboardStyle = window.getComputedStyle(clipboardBtn)
    const clipboardWidth =
      clipboardBtn.offsetWidth +
      parseFloat(clipboardStyle.marginLeft || "0") +
      parseFloat(clipboardStyle.marginRight || "0")

    // Set expand button position
    expandBtn.style.right = `calc(${clipboardWidth}px + 0.3rem)`
    pre.prepend(expandBtn)

    // query popup container
    const popupContainer = pre.querySelector("#mermaid-container") as HTMLElement
    if (!popupContainer) return

    let panZoom: DiagramPanZoom | null = null

    function showMermaid() {
      const container = popupContainer.querySelector("#mermaid-space") as HTMLElement
      const content = popupContainer.querySelector(".mermaid-content") as HTMLElement
      if (!content) return
      removeAllChildren(content)

      // Clone the mermaid content
      const mermaidContent = codeBlock.querySelector("svg")!.cloneNode(true) as SVGElement
      content.appendChild(mermaidContent)

      // Show container
      popupContainer.classList.add("active")
      container.style.cursor = "grab"

      // Initialize pan-zoom after showing the popup
      panZoom = new DiagramPanZoom(container, content)
    }

    function hideMermaid() {
      popupContainer.classList.remove("active")
      panZoom = null
    }

    function handleEscape(e: any) {
      if (e.key === "Escape") {
        hideMermaid()
      }
    }

    const closeBtn = popupContainer.querySelector(".close-button") as HTMLButtonElement

    closeBtn.addEventListener("click", hideMermaid)
    expandBtn.addEventListener("click", showMermaid)
    document.addEventListener("keydown", handleEscape)

    window.addCleanup(() => {
      closeBtn.removeEventListener("click", hideMermaid)
      expandBtn.removeEventListener("click", showMermaid)
      document.removeEventListener("keydown", handleEscape)
    })
  }
})
