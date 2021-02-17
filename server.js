const red = '\x1b[31m'
const blue = '\x1b[36m'
const reset = '\x1b[0m'

const DEV = true//!!process.argv[2]

import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import url from 'url'
import mime from 'mime'
import http from 'http'
import https from 'https'
import ws from 'ws'
import watch from 'node-watch'
import render from './render.js'

let wikiRoot

try {
  let config = JSON.parse(fs.readFileSync('./wiki-config.json'))
  wikiRoot = config.wikiRoot
} catch (e) {
  console.warn('WARNING: no config file found, using ./wiki/ as the default directory\n')
  wikiRoot = './wiki'
}


const serveFile = filePath => (req, res) => {
  let url = filePath === undefined?wikiRoot+req.url:filePath

  fs.readFile(url, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end(`<h1>404!</h1><br><a href="javascript:history.back()">(Go Back)</a>`)
    } else {
      //let encoding = req.url.match(/.gz$/)?'gzip':'identity'
      res.writeHead(200, {
        'Content-Encoding': 'gzip',
        'Content-Type': mime.getType(req.url)
      })
      zlib.gzip(data, function (_, result) {
        res.end(result)
      })
    }
  })
}

let serveJSON = (object, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(object))
}

let serveTemplate = async (template, filename, req, res) =>{
  /*
  let data = inject
  if (typeof inject === 'function') data = await inject(req,res)
  */

  res.writeHead(200)
  let html = await render(template, {filename, url: req.url, wikiRoot})
  res.end(html)
}

let route = async (request, response) =>{
    try {
      if (request.url === '/') request.url = "/index.md"
      if (request.url.slice(0,3) === '/s/') {
        let path = './static/'+request.url.slice(3)
        await serveFile(path)(request, response)
      } else if (request.url === '/style.css') {
        await serveFile('./node_modules/highlight.js/styles/monokai.css')(request, response)
      } else {
        let filename = request.url.split("/").pop()
        let ext = filename.split(".").pop()
        //TODO this has edge cases, fix
        if (ext === undefined) {
          let source = fs.readFileSync(wikiRoot+request.url+'.md').toString()
          console.log(wikiRoot+request.url+'.md')
          await serveTemplate(source,filename,request, response)
        } else if (ext === "raw") {
          //TODO: this CANT be fast right?
          let path = request.url.split('.').slice(0,-1).join('.')
          await serveFile(wikiRoot+path)(request, response)
        } else if (ext === "md") {
          let source = fs.readFileSync(wikiRoot+request.url).toString()
          console.log(wikiRoot+request.url)
          await serveTemplate(source,filename,request, response)
        } else {
          await serveFile(wikiRoot+request.url)(request, response)
        }
      }
    } catch (e) {
      console.log(e)
      response.writeHead(500)
      response.end(`
      <h3>500: Internal Server Error</h3>
      <div>${e}<div>
      <pre><code>${e.stack}</code></pre>
      `)
    }
  }

const routeSocket = message => {
  //websockets API router
  switch (message.type) {
    case 'TEST':
      console.log(message)
      break
  }
}

let serverLogic = (req, res) => {
  switch (req.method) {
    case 'GET' :
      console.log(`[${new Date().toLocaleString()}] ${req.connection.remoteAddress} using ${req.headers["user-agent"]} wants ${req.url}`)
      route(req, res)
      break
    case 'POST' :
      let body = ''
      req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
      })
      req.on('end', () => {
        //console.log(body,req.url);
        //lolllll
        fs.writeFileSync(wikiRoot+req.url, body)
        res.end('ok');
      })
      break
  }
}

let wsClients = []
watch(wikiRoot, { recursive: true }, ()=> wsClients.forEach(c => c.send('')))
watch("./", { recursive: true }, ()=> wsClients.forEach(c => c.send('')))

const onWsClient = wsClient => {
  wsClients.push(wsClient)
  console.log('new connection: #'+wsClients.length)
  wsClient.on('message', (msg,i) => {
  })
  wsClient.on('error', (msg,i) => {
    console.log('(　･ัω･ั)？')
    console.log(msg)
    console.log(i)
  })
  wsClient.on('close', ev => {
    wsClients.splice(wsClients.findIndex(x => x === wsClient),1)
  })
}

if (!DEV) {
  let settings = {
    //IMPORTANT REPLACE THIS WITH THE PUBLIC IP FOR SSL TO WORK
    //additionally 3001 needs to be forwarded to 433 and 3000 -> 80
    sslHost: 'IP.ADDY.GOES.HERE',
    sslPort: 3001,
    port: 3000,
    sslOpts: {
      key: fs.readFileSync('certs/privkey.pem'),
      cert: fs.readFileSync('certs/fullchain.pem')
    }
  }
  let server = https.createServer(settings.sslOpts, serverLogic).listen(settings.sslPort, settings.sslHost)
  let redirectHttp = http.createServer((req,res) => {
    if (req.method === 'GET') {
      console.log("get",req.url)
      res.writeHead(302, {
        //REDIRECT TO SSL PUT SSL URL HERE
        'Location': 'https://WEBSITE.URL.GOES.HERE'+req.url
      })
      res.end()
    }
  }).listen(settings.port, settings.sslHost)
  //let wss = new ws.Server({server})
  //wss.on('connection', wsrouter)
} else {
  let server = http.createServer(serverLogic).listen(1337, '0.0.0.0')
  let wsServer = new ws.Server({server})
  wsServer.on('connection', onWsClient)
  console.log(`Welcome to Superluminal\nC<-\n\nnow serving ${wikiRoot} on port 8080`)
}

