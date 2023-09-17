\<%\*
const dv = this.DataviewAPI
const escapePipe = s => new String(s).replace(/\|/, '\\|') // required for 
const folder = "Logs/Monthly"
const query = '"Logs/Monthly"'
const representive = "Monthly Logs"
const representative = "Monthly Logs"
%>

|Title|Tags|
|-----|----|
|\<%||
|dv.pages(query)||
|.where(p => p.file.name !== representive)||
|.map(p => {||
|let title = p.file.name||
|let tags = p.tags.map(t => { return `#${t}` }).join(", ")||
|return \`|*${title}*|
|})||
|.join("\n")||
|%>||
