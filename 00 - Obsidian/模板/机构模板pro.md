---
abbr: {{ppb.institute.abbr}}
aliases:
{{ppb.institute.aliases}}
website: {{ppb.institute.website}}
location:
  - {{ppb.institute.lat}}
  - {{ppb.institute.lon}}
logo: {{ppb.institute.logo}}
name: {{ppb.institute.name}}
tags:
- institute
---

# {{ppb.institute.name}}

{{ppb.institute.website}}

## Overview

> [!tip] 关于地图
> 坐标写在 frontmatter 的 `location` 里，Map View 会自动收录本条笔记。
> 想在本页内嵌一张小地图，手动加一个 `mapview` 代码块即可——本模板不预置，
> 因为占位符没有条件判断能力：ROR 未提供坐标时会渲染出 `"centerLat":,`
> 这样的非法 JSON，让代码块报错。手工填写的 `机构模板.md` 则做了条件处理。

## Affiliated Scholars

![[学者检索.base]]
