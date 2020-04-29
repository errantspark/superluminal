import fs from 'fs'
import marked from 'marked'
import watch from 'node-watch'
import hljs from 'highlight.js'

let applyTemplate = template => object => {
  let keys = Object.keys(object)
  return new Function('input' , `let {${keys.join(',')}} = input
return \`${template}\``)(object)
}

let template = fs.readFileSync('./default.html').toString()
watch('./default.html', ()=>template = fs.readFileSync('./default.html').toString())
// Set options
// `highlight` example uses `highlight.js`
marked.setOptions({
  renderer: new marked.Renderer(),
  
  highlight: function(code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(validLanguage, code).value;
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

let preProcess = (template, object = {}) => {
  template += ""
  let keys = Object.keys(object)
  return new Function('input' , `let {${keys.join(',')}} = input
return \`${template.replace(/`/gim,"\\\`")}\``)(object)
}


const render = (jsMarkdownString, filename) => {
  let body = marked(preProcess(jsMarkdownString))
  return applyTemplate(template)({
    title: filename,
    body
  })
}

export default render
