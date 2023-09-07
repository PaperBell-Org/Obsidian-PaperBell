---
alias:
- Pablo
gender: 男
birthday:
email: 
- pastudillo@usfq.edu.ec
title:
- Assistant Professor
website: https://www.pastudillo.com
photo: "https://static.wixstatic.com/media/d6dc58_95a32ff8e79a451e80aa25ef8d83cd26~mv2.jpeg/v1/fill/w_974,h_974,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/69751614_10157721109604180_4909437572570.jpeg"
tags: scholar
institute:
- Universidad San Francisco de Quito
name: Pablo A. Astudillo-Estévez
following_date: 2023-09-07
---
## 基本信息
````ad-flex

<div>

<br>

🧑‍🔬`=(this.name)`
📮`=(this.email)`
🏫`=link(this.institute)`
🔗`=(this.website)`

</div>


<div>


`=("![](" + this.photo + ")")`


</div>

````
## 研究兴趣
- 
## 相关论文
```dataviewjs
let names = dv.current().alias ? dv.current().alias : [];
names.push(dv.current().name)

// 参考 https://forum.obsidian.md/t/for-loops-and-dataviewjs/46284
// every: 每个要素都在；
// some: 某个要素在

dv.table(["论文","期刊","年份"],
dv.pages(`#paper`)
	.where(t => names.some(x => t.authors.includes(x)))
	.map(b => [b.file.link, b.journal, b.paper_date])
	.sort(b => b.paper_date, 'desc')
)
```
## 最新动态
```dataviewjs

let folderChoicePath = "00 - 每日日记/DailyNote"
const files = app.vault.getMarkdownFiles().filter(file => file.path.includes(folderChoicePath))
let names = dv.current().alias ? dv.current().alias : [];
names.push(dv.current().name)


let arr = files.map(async(file) => { 
    const content = await app.vault.cachedRead(file) 
    let lines = await content.split("\n").filter(line => names.some(name => line.includes(name)))
    //console.log(lines) 
    return ["[["+file.name.split(".")[0]+"]]", lines] 
}) 

Promise.all(arr).then(values => { 
    const beautify = values.map(value => { 
        const temp = value[1].map(line => { return line }) //美化要重写
        return [value[0],temp] 
    }) 
    const exists = beautify.filter(value => value[1][0] && value[0] != "[[未命名 10]]") .sort(value => value[0],'desc') 
    dv.table(["日期", "动态"], exists) 
})
```