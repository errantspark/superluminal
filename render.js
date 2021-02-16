import fs from 'fs'
import marked from 'marked'
import watch from 'node-watch'
import hljs from 'highlight.js'

let applyTemplate = template => object => {
  let keys = Object.keys(object)
  return new Function('input' , `let {${keys.join(',')}} = input
return \`${template}\``)(object)
}

let template = fs.readFileSync('./static/default.html').toString()
watch('./static/default.html', ()=>template = fs.readFileSync('./static/default.html').toString())
// Set options
// `highlight` example uses `highlight.js`
const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  '`': "&grave;",
  "'": "&#39;"
};

const escape = input => {
  return input.replace(/([&<>'"\`])/g, char => escapeMap[char]);
}

marked.setOptions({
  renderer: new marked.Renderer(),
  
  highlight: function(code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
    const highlighted =  hljs.highlight(validLanguage, code).value
    return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});
 
//FUCKING LOL DUDE, FUCKING LOL
let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

let preProcess = (template, object = {}) => {
  template += ""
  let keys = Object.keys(object)
  return new AsyncFunction('input' , `let {${keys.join(',')}} = input
return \`${template.replace(/`/gim,"\\\`")}\``)(object)
}


const render = async (jsMarkdownString, {filename, wikiRoot, url}) => {
  let listDir = dir => {
    //let fs = await import('fs')
    console.log(wikiRoot+(dir?`/${dir}`:''))
    return fs.readdirSync(wikiRoot+(dir?`/${dir}`:''))
  }
  let body = marked(await preProcess(jsMarkdownString, {escape,filename,url,wikiRoot,listDir}))
  return applyTemplate(template)({
    title: filename,
    body
  })
}


export default render
