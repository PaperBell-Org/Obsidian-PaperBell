/*
	This is the Obsidian example vault is amazing, there are a lot of dazzling features and showcase, I believe you will wonder a bit, is this Obsidian?
	[Blue-topaz-examples](https://github.com/cumany/Blue-topaz-examples)
	*/

var Le=Object.create;var O=Object.defineProperty,Ae=Object.defineProperties,He=Object.getOwnPropertyDescriptor,ke=Object.getOwnPropertyDescriptors,Me=Object.getOwnPropertyNames,K=Object.getOwnPropertySymbols,Fe=Object.getPrototypeOf,X=Object.prototype.hasOwnProperty,Oe=Object.prototype.propertyIsEnumerable;var Y=(n,e,t)=>e in n?O(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,B=(n,e)=>{for(var t in e||(e={}))X.call(e,t)&&Y(n,t,e[t]);if(K)for(var t of K(e))Oe.call(e,t)&&Y(n,t,e[t]);return n},_=(n,e)=>Ae(n,ke(e)),J=n=>O(n,"__esModule",{value:!0});var De=(n,e)=>{J(n);for(var t in e)O(n,t,{get:e[t],enumerable:!0})},Ie=(n,e,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Me(e))!X.call(n,i)&&i!=="default"&&O(n,i,{get:()=>e[i],enumerable:!(t=He(e,i))||t.enumerable});return n},$=n=>Ie(J(O(n!=null?Le(Fe(n)):{},"default",n&&n.__esModule&&"default"in n?{get:()=>n.default,enumerable:!0}:{value:n,enumerable:!0})),n);var w=(n,e,t)=>new Promise((i,o)=>{var l=s=>{try{r(t.next(s))}catch(c){o(c)}},a=s=>{try{r(t.throw(s))}catch(c){o(c)}},r=s=>s.done?i(s.value):Promise.resolve(s.value).then(l,a);r((t=t.apply(n,e)).next())});De(exports,{default:()=>G,refresh_node:()=>xe,selfDestruct:()=>M});var v=$(require("obsidian"));var b=$(require("obsidian"));function D(n,e){return n+1<e.length?e[n+1].level>e[n].level:!1}function R(n,e,t){let i,o;n instanceof MouseEvent?(n.stopPropagation(),i=e,o=t||!1):(i=n,o=e);let l=i.getAttribute("isCollapsed");l!==null&&(l==="true"?Pe(i,o):l==="false"&&Ve(i))}function Pe(n,e){n.setAttribute("isCollapsed","false");let t=parseInt(n.getAttribute("data-level")),i=n.nextElementSibling;if(e)for(;i&&parseInt(i.getAttribute("data-level"))>t;)i.style.display="block",i.getAttribute("isCollapsed")!==null&&i.setAttribute("isCollapsed","false"),i=i.nextElementSibling;else{let o=!1,l=Number.MAX_VALUE;for(;i&&parseInt(i.getAttribute("data-level"))>t;){let a=i.getAttribute("isCollapsed")!==null,r=parseInt(i.getAttribute("data-level"));o?r<=l&&(i.style.display="block",o=a,l=a?r:Number.MAX_VALUE):(a&&(o=!0,l=r),i.style.display="block"),i=i.nextElementSibling}}}function Ve(n){n.setAttribute("isCollapsed","true");let e=parseInt(n.getAttribute("data-level")),t=n.nextElementSibling;for(;t&&parseInt(t.getAttribute("data-level"))>e;)t.style.display="none",t.getAttribute("isCollapsed")!==null&&t.setAttribute("isCollapsed","true"),t=t.nextElementSibling}function Q(n,e){n.querySelectorAll("li.heading-list-item[iscollapsed]").forEach(i=>{let o=i,l=o.getAttribute("isCollapsed")==="true";e!==!l&&R(o,e)})}function Ne(n,e,t,i,o,l){return w(this,null,function*(){let a=/^(?:\s*)[0-9]+\.\s/,r=/^(?:\s*)[\-\+]\s/,s,c="";(s=a.exec(t))!==null?(c=s[0],t=t.replace(a,"")):(s=r.exec(t))!==null&&(c=s[0],t=t.replace(r,""));let g=Number(i.parentElement.getAttribute("data-id")),u=Number(i.parentElement.getAttribute("data-level")),h=d=>{d.stopImmediatePropagation(),R(d,i.parentElement,n.settings.expandAllSubheadings)};i.parentElement.addEventListener("click",h),i.parentElement.hasAttribute("isCollapsed")?D(g,n.headingdata)||(i.parentElement.removeAttribute("isCollapsed"),i.parentElement.removeEventListener("click",h)):D(g,n.headingdata)&&i.parentElement.setAttribute("isCollapsed","false");let f=i;l=new b.Component,yield b.MarkdownRenderer.renderMarkdown(t,f,o,l),f&&f.classList.add("heading-rendered");let y=f.createEl("a");y.addClass("text"),y.onclick=function(d){var C;d.stopPropagation();let m=(C=parseInt(f.parentElement.getAttribute("data-line")))!=null?C:0;if(d.ctrlKey||d.metaKey)qe(e,m);else{$e(e,m);let T=f.parentElement.parentElement.querySelector(".text-wrap.located");T&&T.removeClass("located"),f.addClass("located")}};let p=f.querySelector("p");if(p){let d=/<a[^>]*>|<\/[^>]*a>/gm;c?y.innerHTML=c+p.innerHTML.replace(d,""):y.innerHTML=p.innerHTML.replace(d,""),f.removeChild(p),n.settings.isTooltip&&(f.setAttribute("aria-label",t),n.settings.positionStyle=="right"&&f.setAttribute("aria-label-position","left"),n.settings.positionStyle=="left"&&f.setAttribute("aria-label-position","right"),n.settings.positionStyle=="both"&&f.setAttribute("aria-label-position","top"))}})}function I(n,e,t,i,o){return w(this,null,function*(){var s,c,g,u,h,f;let l=t.createEl("li");l.addClass("heading-list-item"),l.setAttribute("data-level",(c=(s=i==null?void 0:i.level)==null?void 0:s.toString())!=null?c:""),l.setAttribute("data-id",o.toString()),l.setAttribute("data-line",(f=(h=(u=(g=i==null?void 0:i.position)==null?void 0:g.start)==null?void 0:u.line)==null?void 0:h.toString())!=null?f:"");let a=l.createEl("div");a.addClass("text-wrap"),yield Ne(n,e,i.heading,a,e.file.path,null);let r=l.createEl("div");r.addClass("line-wrap"),r.createDiv().addClass("line")})}var $e=(n,e)=>{n.leaf.openFile(n.file,{eState:{line:e}})},qe=(n,e)=>{var l,a;let t=(a=(l=n==null?void 0:n.currentMode.getFoldInfo())==null?void 0:l.folds)!=null?a:[],i=e,o=0;if(t.some((r,s)=>(o=s,r.from==i)))t.splice(o,1);else{let r={from:e,to:e+1};t.push(r)}n==null||n.currentMode.applyFoldInfo({folds:t,lines:n.editor.lineCount()}),n==null||n.onMarkdownFold()};function q(n,e){var o;let t=(l,a)=>{var f,y,p;let r=n.workspace.getActiveFile(),s=n.metadataCache.getFileCache(r).headings,c=[];if(s==null||s.map(d=>{d.heading=d.heading.replace(/<\/?[\s\S]*?(?:".*")*>/g,""),c.push(d)}),e.headingdata=c,e.headingdata.length==0)return;e.settings.positionStyle=="right"?(a.addClass("floating-right"),a.removeClass("floating-left"),a.removeClass("floating-both")):e.settings.positionStyle=="left"?(a.addClass("floating-left"),a.removeClass("floating-rigth"),a.removeClass("floating-both")):e.settings.positionStyle=="both"&&(a.addClass("floating-both"),a.removeClass("floating-left"),a.removeClass("floating-rigth")),e.settings.isLeft?(a.removeClass("alignLeft"),a.addClass("alignLeft")):a.removeClass("alignLeft");let g=a.createEl("ul");g.addClass("floating-toc");let u=a.createEl("div");if(W(e,u,a),e.settings.ignoreHeaders){let d=e.settings.ignoreHeaders.split(`
`);e.headingdata=(f=n.metadataCache.getFileCache(r).headings)==null?void 0:f.filter(m=>!d.includes(m.level.toString()))}(()=>{let d=e.headingdata.length,m=n.workspace.getActiveViewOfType(b.MarkdownView);if(d>50){let C=20,T=e.headingdata.slice(0,C),S=document.createElement("div");S.className="toc-loading-indicator",S.textContent=`Loading... (${C}/${d})`,S.style.textAlign="center",S.style.padding="8px",S.style.color="var(--text-muted)",S.style.fontSize="0.8em",S.style.position="fixed",S.style.top="45px",T.forEach((x,L)=>{I(e,m,g,x,L)}),g.appendChild(S);let k=C,P=20,F=()=>{let x=Math.min(k+P,d);S.textContent=`\u52A0\u8F7D\u4E2D... (${x}/${d})`;for(let L=k;L<x;L++)I(e,m,g,e.headingdata[L],L);k=x,k<d?requestAnimationFrame(()=>{setTimeout(F,10)}):S.remove()};setTimeout(F,50)}else e.headingdata.forEach((C,T)=>{I(e,m,g,C,T)})})(),((y=l==null?void 0:l.querySelector(".markdown-source-view"))==null?void 0:y.insertAdjacentElement("beforebegin",a))||((p=l==null?void 0:l.querySelector(".markdown-reading-view"))==null||p.insertAdjacentElement("beforebegin",a))};if(this.app.workspace.getActiveViewOfType(b.MarkdownView)){(0,b.requireApiVersion)("0.15.0")?activeDocument=activeWindow.document:activeDocument=window.document;let l=e.app.workspace.getActiveViewOfType(b.MarkdownView);if(l){if((o=l.contentEl)==null?void 0:o.querySelector(".floating-toc-div"))return;{let r=createEl("div");r.addClass("floating-toc-div"),e.settings.isDefaultPin&&r.addClass("pin"),t(l.contentEl,r),e.updateTocWidth(r,e.headingdata)}}}}function W(n,e,t){e.addClass("toolbar"),e.addClass("hide"),new b.ButtonComponent(e).setIcon("pin").setTooltip("pin").onClick(()=>{t.classList.contains("pin")?t.removeClass("pin"):t.addClass("pin")}),new b.ButtonComponent(e).setIcon("double-up-arrow-glyph").setTooltip("Scroll to Top").setClass("top").onClick(()=>{let s=this.app.workspace.getActiveViewOfType(b.MarkdownView);s&&s.setEphemeralState({scroll:0})}),new b.ButtonComponent(e).setIcon("double-down-arrow-glyph").setTooltip("Scroll to Bottom").setClass("bottom").onClick(()=>w(this,null,function*(){let s=this.app.workspace.getActiveViewOfType(b.MarkdownView);if(s){let c=this.app.workspace.getActiveFile(),u=(yield this.app.vault.cachedRead(c)).split(`
`),h=u.length;if(s.getMode()==="preview")for(;h>0&&u[h-1].trim()==="";)h--;s.currentMode.applyScroll(h-1)}})),new b.ButtonComponent(e).setIcon("copy").setTooltip("copy TOC to clipboard").setClass("copy").onClick(()=>w(this,null,function*(){let s=n.headingdata.map(c=>`${"    ".repeat(c.level-1)}- [[#${c.heading}]]`);yield navigator.clipboard.writeText(s.join(`
`)),new b.Notice("TOC Copied")}));let r=new b.ButtonComponent(e).setIcon("chevron-down").setTooltip("Collapse/Expand all headings").setClass("toggle-all").onClick(()=>{let s=t.getAttribute("data-all-expanded")==="true";r.setIcon(s?"chevron-right":"chevron-down"),Q(t,!s),t.setAttribute("data-all-expanded",(!s).toString())});t.hasAttribute("has-events")||(t.onmouseenter=function(){e==null||e.removeClass("hide"),t.addClass("hover")},t.onmouseleave=function(){e==null||e.addClass("hide"),t.removeClass("hover")},t.setAttribute("has-events","true"))}var A=$(require("obsidian"));var Z=["left","right","both"],ee={ignoreHeaders:"",ignoreTopHeader:!1,positionStyle:"left",isLoadOnMobile:!0,isLeft:!1,isDefaultPin:!1,isTooltip:!1,defaultCollapsedLevel:6,expandAllSubheadings:!1};var we=$(require("obsidian"));var te={};var ie={};var ne={};var le={};var z={"ctrl + click on the floating toc to collapse/expand the header.":"ctrl + click on the floating toc to collapse/expand the header.","Floating TOC position":"Floating TOC position","Floating TOC position, default on the left side of the notes":"Floating TOC position, default on the left side of the notes","Hide heading level":"Hide heading level","Whichever option is selected, the corresponding heading level will be hidden":"Whichever option is selected, the corresponding heading level will be hidden","Plugin Settings":"Plugin Settings","Default Pin":"Default Pin","Enable Tooltip":"Enable Tooltip","Plugin Style Settings":"Plugin Style Settings","Mobile enabled or not":"Mobile enabled or not","Whether to enable the plugin for the mobile client, the default is enabled.":"Whether to enable the plugin for the mobile client, the default is enabled.","If the floating Toc option is not found in the style setting, please reload the style setting plugin (turn it off and on again)":"If the floating Toc option is not found in the style setting, please reload the style setting plugin (turn it off and on again)","Left alignment of TOC text":"Left alignment of TOC text","Aligned on both sides":"Aligned on both sides","Floating TOC position, on the right side of the notes":"Floating TOC position, on the right side of the notes","whether the text in TOC is left aligned":"whether the text in TOC is left aligned","When the panel is split left and right, the right side of the layout is aligned right and the left side of the panel is aligned left.":"When the panel is split left and right, the right side of the layout is aligned right and the left side of the panel is aligned left.","Set the default collapsed level of headings when initialised":"Set the default collapsed level of headings when initialised","Default Collapsed Level":"Default Collapsed Levels","Expand All Subheadings Recursively":"Expand All Subheadings Recursively","When disabled, only direct subheadings will be expanded":"When disabled, only direct subheadings will be expanded"};var ae={};var oe={};var se={};var re={};var de={};var ce={};var he={};var ge={};var pe={};var fe={};var ue={};var me={};var ve={};var be={};var Ce={};var Ee={};var ye={"ctrl + click on the floating toc to collapse/expand the header.":"\u6309\u4F4Fctrl \u70B9\u51FB\u76EE\u5F55\u4E2D\u7684\u6807\u9898\uFF0C\u53EF\u4EE5\u4F7F\u5BF9\u5E94\u7684\u6B63\u6587\u5185\u5BB9\u6298\u53E0/\u5C55\u5F00\u3002","Floating TOC position":"\u6D6E\u52A8\u76EE\u5F55\u663E\u793A\u4F4D\u7F6E","Floating TOC position, default on the left side of the notes":"\u6D6E\u52A8\u76EE\u5F55\u663E\u793A\u4F4D\u7F6E\uFF0C\u9ED8\u8BA4\u663E\u793A\u5728\u7B14\u8BB0\u5DE6\u4FA7","Hide heading level":"\u9690\u85CF\u6307\u5B9A\u7684\u6807\u9898\u5C42\u7EA7","Whichever option is selected, the corresponding heading level will be hidden":"\u9690\u85CF\u9009\u4E2D\u7684\u6807\u9898\u5C42\u7EA7\uFF0C\u9009\u4E2D\u7684\u6807\u9898\u4E0D\u4F1A\u5728\u6D6E\u52A8\u76EE\u5F55\u4E2D\u663E\u793A\u3002","Plugin Settings":"\u63D2\u4EF6\u8BBE\u7F6E","Default Pin":"\u662F\u5426\u9ED8\u8BA4\u9489\u5728\u7B14\u8BB0\u4E0A","Enable Tooltip":"\u662F\u5426\u5F00\u542F\u6807\u9898\u63D0\u793A","Plugin Style Settings":"\u63D2\u4EF6\u6837\u5F0F\u8BBE\u7F6E","Mobile enabled or not":"\u662F\u5426\u5728\u79FB\u52A8\u7AEF\u542F\u7528","Whether to enable the plugin for the mobile client, the default is enabled.":"\u79FB\u52A8\u5BA2\u6237\u7AEF\u662F\u5426\u542F\u7528\u63D2\u4EF6\uFF0C\u9ED8\u8BA4\u542F\u7528\u3002","If the floating Toc option is not found in the style setting, please reload the style setting plugin (turn it off and on again)":"\u5982\u679Cstyle setting \u4E2D\u65E0\u6CD5\u770B\u5230 floating Toc\u9009\u9879\uFF0C\u8BF7\u91CD\u8F7Dstyle setting\u63D2\u4EF6\uFF08\u5173\u95ED\u518D\u5F00\u542F\u5373\u53EF\uFF09","Left alignment of TOC text":"\u76EE\u5F55\u6587\u5B57\u5DE6\u5BF9\u9F50","Floating TOC position, on the right side of the notes":"\u6D6E\u52A8\u76EE\u5F55\u663E\u793A\u4F4D\u7F6E\uFF0C\u663E\u793A\u5728\u7B14\u8BB0\u53F3\u4FA7","whether the text in TOC is left aligned":"\u5F53\u5DE5\u5177\u680F\u5728\u53F3\u4FA7\u65F6\uFF0C\u76EE\u5F55\u4E2D\u7684\u6807\u9898\u662F\u5426\u5DE6\u5BF9\u9F50","Aligned on both sides":"\u4E24\u7AEF\u5BF9\u9F50","When the panel is split left and right, the right side of the layout is aligned right and the left side of the panel is aligned left.":"\u5F53\u9762\u677F\u5DE6\u53F3\u5206\u5272\u7684\u65F6\u5019\uFF0C\u53F3\u4FA7\u7248\u9762\u53F3\u5BF9\u9F50\uFF0C\u5DE6\u4FA7\u9762\u677F\u5DE6\u5BF9\u9F50\u3002","Set the default collapsed level of headings when initialised":"\u8BBE\u7F6E\u521D\u59CB\u5316\u65F6TOC\u4E2D\u9ED8\u8BA4\u6298\u53E0\u7684\u6807\u9898\u7EA7\u522B","Default Collapsed Level":"\u9ED8\u8BA4\u6298\u53E0\u7EA7\u522B","Expand All Subheadings Recursively":"\u9012\u5F52\u5C55\u5F00\u6240\u6709\u5B50\u6807\u9898","When disabled, only direct subheadings will be expanded":"\u5173\u95ED\u6B64\u9009\u9879\u65F6, \u53EA\u5C55\u5F00\u76F4\u63A5\u5B50\u6807\u9898"};var Te={"Floating TOC position":"\u6D6E\u52D5\u76EE\u9304\u986F\u793A\u4F4D\u7F6E","Floating TOC position, default on the left side of the notes":"\u6D6E\u52D5\u76EE\u9304\u986F\u793A\u4F4D\u7F6E\uFF0C\u9ED8\u8A8D\u986F\u793A\u5728\u7B46\u8A18\u5DE6\u5074","Ignore top-level headers":"\u662F\u5426\u5FFD\u7565\u9802\u7D1A\u76EE\u9304","Select whether to ignore the top-level headings. When turned on, the top-level headings in the current note are not displayed in the floating TOC.":"\u9078\u64C7\u662F\u5426\u5FFD\u7565\u9802\u7D1A\u6A19\u984C\uFF0C\u958B\u555F\u5F8C\u7576\u524D\u6587\u6A94\u4E2D\u6700\u9802\u7D1A\u7684\u6A19\u984C\u4E0D\u986F\u793A\u5728\u6D6E\u52D5\u76EE\u9304\u4E2D\u3002","Plugin Settings":"\u63D2\u4EF6\u8A2D\u7F6E","Default Pin":"\u662F\u5426\u9ED8\u8A8D\u91D8\u5728\u7B46\u8A18\u4E0A","Plugin Style Settings":"\u63D2\u4EF6\u6A23\u5F0F\u8A2D\u7F6E","Mobile enabled or not":"\u662F\u5426\u5728\u79FB\u52D5\u7AEF\u555F\u7528","Whether to enable the plugin for the mobile client, the default is enabled.":"\u79FB\u52D5\u5BA2\u6236\u7AEF\u662F\u5426\u555F\u7528\u63D2\u4EF6\uFF0C\u9ED8\u8A8D\u555F\u7528\u3002","If the floating Toc option is not found in the style setting, please reload the style setting plugin (turn it off and on again)":"\u5982\u679Cstyle setting \u4E2D\u7121\u6CD5\u770B\u5230 floating Toc\u9078\u9805\uFF0C\u8ACB\u91CD\u8F09style setting\u63D2\u4EF6\uFF08\u95DC\u9589\u518D\u958B\u555F\u5373\u53EF\uFF09","Left alignment of TOC text":"\u76EE\u9304\u6587\u5B57\u5DE6\u5C0D\u9F4A","Floating TOC position, on the right side of the notes":"\u6D6E\u52D5\u76EE\u9304\u986F\u793A\u4F4D\u7F6E\uFF0C\u986F\u793A\u5728\u7B46\u8A18\u53F3\u5074","whether the text in TOC is left or right aligned When the floating toc is on the right":"\u7576\u5DE5\u5177\u6B04\u5728\u53F3\u5074\u6642\uFF0C\u76EE\u9304\u4E2D\u7684\u6A19\u984C\u662F\u5426\u5DE6\u5C0D\u9F4A","Aligned on both sides":"\u5169\u7AEF\u5C0D\u9F4A","When the panel is split left and right, the right side of the layout is aligned right and the left side of the panel is aligned left.":"\u7576\u9762\u677F\u5DE6\u53F3\u5206\u5272\u7684\u6642\u5019\uFF0C\u53F3\u5074\u7248\u9762\u53F3\u5C0D\u9F4A\uFF0C\u5DE6\u5074\u9762\u677F\u5DE6\u5C0D\u9F4A\u3002"};var Be={ar:te,cs:ie,da:ne,de:le,en:z,"en-gb":ae,es:oe,fr:se,hi:re,id:de,it:ce,ja:he,ko:ge,nl:pe,nn:fe,pl:ue,pt:me,"pt-br":ve,ro:be,ru:Ce,tr:Ee,"zh-cn":ye,"zh-tw":Te},Se=Be[we.moment.locale()];function E(n){return Se&&Se[n]||z[n]}var j=class{constructor(e){this.checkedList=[];this.containerEl=e,this.flowListEl=this.containerEl.createDiv({cls:"check-list"})}addItem(e,t,i,o){let l=this.flowListEl.createDiv({cls:"check-item"}),a=l.createEl("input",{type:"checkbox"});return a.checked=i,a.checked&&this.checkedList.push(t),a.addEventListener("change",s=>{a.checked?this.checkedList.includes(t)||this.checkedList.push(t):this.checkedList.includes(t)&&this.checkedList.remove(t)}),a.addEventListener("change",s=>o(a.checked)),l.createDiv({cls:"flow-label"}).setText(e),l}};var U=class extends A.PluginSettingTab{constructor(e,t){super(e,t);this.plugin=t,addEventListener("refresh-toc",()=>{M(),q(e,this.plugin)})}display(){let{containerEl:e}=this;e.empty(),e.createEl("h1",{text:"Obsidian Floating TOC "}),e.createEl("span",{text:""}).createEl("a",{text:"Author: Cuman \u2728",href:"https://github.com/cumany"}),e.createEl("span",{text:""}).createEl("a",{text:"Readme:\u4E2D\u6587",href:"https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6/floating-toc/"}),e.createEl("span",{text:""}).createEl("a",{text:"|English  ",href:"https://github.com/cumany/obsidian-floating-toc-plugin/blob/master/README.md"});let t=e.createEl("div");t.addClass("callout"),t.setAttribute("data-callout","info");let i=t.createEl("div",{text:"\u{1F511}TIPS:"});i.addClass("callout-title"),i.createEl("br"),t.createEl("div",{text:E("ctrl + click on the floating toc to collapse/expand the header.")}).addClass("callout-content"),e.createEl("h2",{text:E("Plugin Settings")});let l=new A.Setting(e);l.setName(E("Floating TOC position")),this.plugin.settings.positionStyle=="both"?l.setDesc(E("When the panel is split left and right, the right side of the layout is aligned right and the left side of the panel is aligned left.")):this.plugin.settings.positionStyle=="right"?l.setDesc(E("Floating TOC position, on the right side of the notes")):l.setDesc(E("Floating TOC position, default on the left side of the notes")),l.addDropdown(p=>{let d={};Z.map(m=>d[m]=m),p.addOptions(d),p.setValue(this.plugin.settings.positionStyle).onChange(m=>{this.plugin.settings.positionStyle=m,this.plugin.saveSettings(),setTimeout(()=>{this.display(),dispatchEvent(new Event("refresh-toc"))},100)})}),this.plugin.settings.positionStyle!="left"&&new A.Setting(e).setName(E("Left alignment of TOC text")).setDesc(E("whether the text in TOC is left aligned")).addToggle(p=>{var d;return p.setValue((d=this.plugin.settings)==null?void 0:d.isLeft).onChange(m=>{this.plugin.settings.isLeft=m,this.plugin.saveSettings(),setTimeout(()=>{this.display(),dispatchEvent(new Event("refresh-toc"))},100)})}),new A.Setting(e).setName(E("Expand All Subheadings Recursively")).setDesc(E("When disabled, only direct subheadings will be expanded")).addToggle(p=>p.setValue(this.plugin.settings.expandAllSubheadings).onChange(d=>{this.plugin.settings.expandAllSubheadings=d,this.plugin.saveSettings(),setTimeout(()=>{dispatchEvent(new Event("refresh-toc"))},100)})),new A.Setting(e).setName(E("Hide heading level")).setDesc(E("Whichever option is selected, the corresponding heading level will be hidden"));let a=new j(e);[1,2,3,4,5,6].forEach(p=>w(this,null,function*(){let m=this.plugin.settings.ignoreHeaders.split(`
`).includes(p.toString());a.addItem(p.toString(),p.toString(),m,C=>{this.plugin.settings.ignoreHeaders=a.checkedList.join(`
`),this.plugin.saveSettings(),setTimeout(()=>{dispatchEvent(new Event("refresh-toc"))},100)})})),new A.Setting(e).setName(E("Default Pin")).addToggle(p=>{var d;return p.setValue((d=this.plugin.settings)==null?void 0:d.isDefaultPin).onChange(m=>{this.plugin.settings.isDefaultPin=m,this.plugin.saveSettings(),setTimeout(()=>{dispatchEvent(new Event("refresh-toc"))},100)})}),new A.Setting(e).setName(E("Enable Tooltip")).addToggle(p=>{var d;return p.setValue((d=this.plugin.settings)==null?void 0:d.isTooltip).onChange(m=>{this.plugin.settings.isTooltip=m,this.plugin.saveSettings(),setTimeout(()=>{dispatchEvent(new Event("refresh-toc"))},100)})}),e.createEl("h2",{text:E("Plugin Style Settings")});let s=e.createEl("div");s.addClass("callout"),s.setAttribute("data-callout","warning"),s.createEl("div",{text:"\u{1F514} Notice: Please click the button again,If the floating-toc option is not found in the style settings"}).addClass("callout-title");let g=s.createEl("div");g.addClass("callout-content"),app.plugins.enabledPlugins.has("obsidian-style-settings")?(g.createEl("br"),new A.ButtonComponent(g).setIcon("palette").setClass("mod-cta").setButtonText("\u{1F3A8} Open style settings").onClick(()=>{app.setting.open(),app.setting.openTabById("obsidian-style-settings"),app.workspace.trigger("parse-style-settings"),setTimeout(()=>{var m,C,T;let d=app.setting.activeTab.containerEl.querySelector(".setting-item-heading[data-id='floating-toc-styles']");d?(m=d.addClass)==null||m.call(d,"float-cta"):(app.workspace.trigger("parse-style-settings"),(T=(C=app.setting.activeTab.containerEl.querySelector(".setting-item-heading[data-id='floating-toc-styles']"))==null?void 0:C.addClass)==null||T.call(C,"float-cta"))},250)})):(g.createEl("br"),g.createEl("span",{text:""}).createEl("a",{text:"Please install or enable the style-settings plugin",href:"obsidian://show-plugin?id=obsidian-style-settings"}));let h=e.createEl("div",{cls:"cDonationSection"}),f=createEl("p"),y=createEl("p");y.appendText("If you like this Plugin and are considering donating to support continued development, use the button below!"),f.setAttribute("style","color: var(--text-muted)"),h.appendChild(y),h.appendChild(f),h.appendChild(_e("https://github.com/cumany#thank-you-very-much-for-your-support"))}},_e=n=>{let e=createEl("a");return e.setAttribute("href",n),e.addClass("buymeacoffee-img"),e.innerHTML='<img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee &emoji=&slug=Cuman&button_colour=BD5FFF&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00" />',e};var H;function M(){(0,v.requireApiVersion)("0.15.0")?H=activeWindow.document:H=window.document,H.querySelectorAll(".floating-toc-div").forEach(e=>{e&&e.remove()})}function xe(n,e){var g,u;(0,v.requireApiVersion)("0.15.0")?H=activeWindow.document:H=window.document;let t=(g=e.contentEl)==null?void 0:g.querySelector(".floating-toc-div");if(!t)return!1;let i=t.querySelector(".toolbar");i||(i=t.createEl("div"),W(n,i,t));let o=t.querySelector("ul.floating-toc");o||(o=t.createEl("ul"),o.addClass("floating-toc"));let l=n.headingdata;if(n.settings.ignoreHeaders){let h=new Set(n.settings.ignoreHeaders.split(`
`));l=(u=n.headingdata)==null?void 0:u.filter(f=>!h.has(f.level.toString()))}if(!l)return o.remove(),!1;l&&l.length>0&&n.updateTocWidth(t,l);let a=new Map;(t==null?void 0:t.querySelectorAll("li.heading-list-item")).forEach(h=>{let f=`${h.getAttribute("data-level")}-${h.getAttribute("data-line")}-${h.children[0].innerText}`;a.set(f,h)});let s=document.createDocumentFragment(),c=new Set(a.values());return l.forEach((h,f)=>{let y=`${h.level}-${h.position.start.line}-${h.heading}`,p=a.get(y);p?(c.delete(p),D(f,n.headingdata)?p.hasAttribute("iscollapsed")||p.setAttribute("isCollapsed","false"):p.hasAttribute("iscollapsed")&&p.removeAttribute("isCollapsed"),s.appendChild(p)):I(n,e,s,h,f)}),c.forEach(h=>h.remove()),o.replaceChildren(s),!0}function Re(n){var e=[];if(n==null?void 0:n.previousElementSibling)for(;n=n.previousElementSibling;)n.nodeType==1&&e.push(n);return e}function We(n,e,t){var o,l,a;let i=t.target;if(((o=i.parentElement)==null?void 0:o.classList.contains("cm-editor"))||((l=i.parentElement)==null?void 0:l.classList.contains("markdown-reading-view"))){let r=n.workspace.getActiveViewOfType(v.MarkdownView);if(!r)return;let s=(a=r.currentMode.getScroll())!=null?a:0,c=e.headingdata;if(!c||c.length===0)return;let g=r.contentEl.querySelector(".floating-toc");if(!g)return;let u=g.querySelectorAll("li.heading-list-item");if(!u.length)return;let h=u[0],f=u[u.length-1],y=parseInt(h.getAttribute("data-line")||"0"),p=parseInt(f.getAttribute("data-line")||"0"),d=0,m=null;if(s<=0)d=y;else{let x=0,L=c.length-1,V=-1;for(;x<=L;){let N=Math.floor((x+L)/2);c[N].position.start.line<=s?(V=N,x=N+1):L=N-1}V!==-1?(d=c[V].position.start.line,m=c[V]):d=y}let C=g.querySelector(".heading-list-item.located");C&&C.removeClass("located");let T=g.querySelector(`li[data-line='${d}']`);if(!T)return;T.addClass("located");let S=parseInt(T.getAttribute("data-level")||"1"),k=S>1?S-1:1,P=g.querySelector("li.focus");P&&P.removeClass("focus");let F=Re(T);for(let x=0;x<F.length;x++){let L=F[x];if(L.dataset.level<=k.toString()){L.addClass("focus");break}}requestAnimationFrame(()=>{T.scrollIntoView({block:"nearest",behavior:"smooth"})})}}var G=class extends v.Plugin{constructor(){super(...arguments);this.isUpdating=!1;this.lastRefreshTime=0;this.REFRESH_COOLDOWN=200;this.currentFile=null;this.updateTocWidth=(0,v.debounce)((e,t)=>{let i=t.reduce((l,a)=>{let s=a.heading.split("").reduce((c,g)=>c+(/[\u4e00-\u9fa5]/.test(g)?1:.6),0);return Math.max(l,s)},0),o=Math.ceil(i)+"rem";document.body.style.setProperty("--actual-toc-width",`${o}`)},100);this.handleScroll=(e,t,i)=>(0,v.debounce)(We(e,t,i),100)}onload(){return w(this,null,function*(){(0,v.requireApiVersion)("0.15.0")?H=activeWindow.document:H=window.document,yield this.loadSettings();let e=i=>{i&&(xe(this,i)||q(this.app,this))};this.addCommand({id:"pin-toc-panel",name:"Pinning the Floating TOC panel",icon:"pin",callback:()=>w(this,null,function*(){let i=this.app.workspace.getActiveViewOfType(v.MarkdownView);if(i){let o=i.contentEl.querySelector(".floating-toc-div");o&&(o.classList.contains("pin")?o.removeClass("pin"):o.addClass("pin"))}})}),this.addCommand({id:"hide-toc-panel",name:"Hide/Show the Floating TOC panel",icon:"list",callback:()=>w(this,null,function*(){let i=this.app.workspace.getActiveViewOfType(v.MarkdownView);if(i){let o=i.contentEl.querySelector(".floating-toc-div");o&&(o.classList.contains("hide")?o.removeClass("hide"):o.addClass("hide"))}})}),this.addCommand({id:"scroll-to-bottom",name:"Scroll to Bottom",icon:"double-down-arrow-glyph",callback:()=>w(this,null,function*(){let i=this.app.workspace.getActiveViewOfType(v.MarkdownView);if(i){let o=this.app.workspace.getActiveFile(),a=(yield this.app.vault.cachedRead(o)).split(`
`),r=a.length;if(i.getMode()==="preview")for(;r>0&&a[r-1].trim()==="";)r--;i.currentMode.applyScroll(r-1)}})}),this.addCommand({id:"scroll-to-top",name:"Scroll to Top",icon:"double-up-arrow-glyph",callback:()=>w(this,null,function*(){let i=this.app.workspace.getActiveViewOfType(v.MarkdownView);i&&i.setEphemeralState({scroll:0})})}),this.addCommand({id:"toggle-position-style",name:"Toggle Floating TOC Position (left/right)",icon:"switch",callback:()=>{this.settings.positionStyle==="left"?this.settings.positionStyle="right":this.settings.positionStyle==="right"?this.settings.positionStyle="left":this.settings.positionStyle==="both"&&new v.Notice("Position style set to both. Toogle position only works when fixed position (left or right) is selected."),this.saveSettings(),dispatchEvent(new Event("refresh-toc"))}}),this.registerEvent(this.app.workspace.on("active-leaf-change",()=>{var r,s,c,g;let i=this.app.workspace.getActiveViewOfType(v.MarkdownView);if(!i)return;let o=(r=i.file)==null?void 0:r.path;if(o===this.currentFile)return;this.currentFile=o;let l=this.app.workspace.getActiveFile();if(!l||!((c=(s=this.app.metadataCache.getFileCache(l))==null?void 0:s.headings)==null?void 0:c.length)){this.headingdata=null,M();return}let a=(g=this.app.metadataCache.getFileCache(l))==null?void 0:g.headings;if(!!a){if(this.headingdata=a,this.settings.ignoreHeaders){let u=this.settings.ignoreHeaders.split(`
`);this.headingdata=a.filter(h=>!u.includes(h.level.toString()))}t(i,!0)}})),this.registerEvent(this.app.metadataCache.on("changed",()=>{var c,g;let i=this.app.workspace.getActiveViewOfType(v.MarkdownView);if(!i||((c=i.file)==null?void 0:c.path)!==this.currentFile)return;let o=i.file,l=(g=this.app.metadataCache.getFileCache(o))==null?void 0:g.headings;if(!(l==null?void 0:l.length)){this.headingdata=null,M();return}let a=l.map(u=>_(B({},u),{heading:this.removeMarkdownSyntax(u.heading)})),r=this.headingdata?this.headingdata.map(u=>_(B({},u),{heading:this.removeMarkdownSyntax(u.heading)})):null;if(this.hasStructuralHeadingChanges(a,r)){if(this.headingdata=l,this.settings.ignoreHeaders){let u=this.settings.ignoreHeaders.split(`
`);this.headingdata=l.filter(h=>!u.includes(h.level.toString()))}t(i,!0)}else this.updateOutlineLineNumbers(i,l)}));let t=(i,o=!1)=>{let l=Date.now();!o&&l-this.lastRefreshTime<this.REFRESH_COOLDOWN||(this.lastRefreshTime=l,e(i))};H.addEventListener("scroll",i=>{this.handleScroll(this.app,this,i)},!0),this.addSettingTab(new U(this.app,this)),e(this.app.workspace.getActiveViewOfType(v.MarkdownView)),this.app.workspace.on("window-open",i=>{console.log("window-open"),i.doc.addEventListener("scroll",o=>{this.handleScroll(this.app,this,o)},!0)}),this.app.workspace.onLayoutReady(()=>{this.app.workspace.trigger("parse-style-settings")})})}removeMarkdownSyntax(e){if(!e)return"";let t=e;return t=t.replace(/\*\*(.*?)\*\*/g,"$1").replace(/__(.*?)__/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/_(.*?)_/g,"$1"),t=t.replace(/`([^`]+)`/g,"$1").replace(/~~(.*?)~~/g,"$1"),t=t.replace(/==(.*?)==/g,"$1"),t=t.replace(/\[(.*?)\]\([^\)]+\)/g,"$1").replace(/\[\[(.*?)(\|.*?)?\]\]/g,"$1"),t=t.replace(/<[^>]+>/g,""),t=t.replace(/^#+\s+/,""),t.trim()}hasHeadingsChanged(e,t){if(!t||e.length!==t.length)return!0;let i=l=>`${l.heading}|${l.level}|${l.position.start.line}`;return!e.every((l,a)=>{let r=t[a],s=i(l),c=i(r);return s===c})}updateOutlineLineNumbers(e,t){var a;let i=(a=e.contentEl)==null?void 0:a.querySelector(".floating-toc-div");if(!i)return;let o=i.querySelectorAll("li.heading-list-item");if(!o.length)return;let l=new Map;t.forEach(r=>{let s=`${this.removeMarkdownSyntax(r.heading)}|${r.level}`;l.set(s,r.position.start.line)}),o.forEach(r=>{let s=r.getAttribute("data-level"),c=r.querySelector(".text-wrap a.text");if(!c)return;let u=`${c.innerText}|${s}`;if(l.has(u)){let h=l.get(u);r.getAttribute("data-line")!==h.toString()&&r.setAttribute("data-line",h.toString())}})}hasStructuralHeadingChanges(e,t){if(!t||e.length!==t.length)return!0;let i=o=>`${this.removeMarkdownSyntax(o.heading)}|${o.level}`;return e.some((o,l)=>{let a=t[l];return i(o)!==i(a)})}onunload(){var e;(0,v.requireApiVersion)("0.15.0")?H=activeWindow.document:H=window.document;try{H.removeEventListener("scroll",t=>{this.handleScroll(this.app,this,t)},!0)}catch(t){console.error("Error removing scroll event listener:",t)}try{let t=this.app.workspace.getActiveViewOfType(v.MarkdownView);if(t){let i=(e=t.contentEl)==null?void 0:e.querySelector(".floating-toc-div");i&&(i.querySelectorAll("li.heading-list-item").forEach(l=>{let a=l.cloneNode(!0);l.parentNode&&l.parentNode.replaceChild(a,l)}),i._tocCleanup&&i._tocCleanup())}}catch(t){console.error("Error cleaning up resources:",t)}M()}setHeadingdata(e){this.headingdata=e}loadSettings(){return w(this,null,function*(){this.settings=Object.assign({},ee,yield this.loadData())})}saveSettings(){return w(this,null,function*(){yield this.saveData(this.settings)})}};

/* nosourcemap */