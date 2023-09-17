\<%\*
const dv = this.DataviewAPI
const escapePipe = s => new String(s).replace(/\|/, '\\|') // required for 
const folder = "Logs/Monthly"
const query = '"Logs/Monthly"'
const representive = "Monthly"
const representative = "Monthly"
const pages = dv.pages(query).filter(p => p.file.name !== representative)

const result = \[\]
for (let group of pages.groupBy(p => p.created.year)) {
result.push(`# ${group.key}\n`)
for (let p of group.rows) {
let title = p.file.name
let row = `- [[${title}]]`
result.push(row)
}
}
result.flat()
return result.join("\n")
%>
