import fs from 'fs'
import marked from 'marked'

let applyTemplate = template => object => {
  let keys = Object.keys(object)
  return new Function('input' , `let {${keys.join(',')}} = input
return \`${template}\``)(object)
}


// Set options
// `highlight` example uses `highlight.js`
let template = fs.readFileSync('./default.html').toString()
let stylesheet = fs.readFileSync('./default.css').toString()
let script = fs.readFileSync('./default.js').toString()
marked.setOptions({
  renderer: new marked.Renderer(),
  /*
  highlight: function(code, language) {
    const hljs = require('highlight.js');
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(validLanguage, code).value;
  },
  */
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
    stylesheet,
    script,
    body
  })
}

export default render
