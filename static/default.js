let host = "ws://"+window.location.host
console.log("connecting to server @ "+host)
let socket = new WebSocket(host)
socket.onmessage = () => location.reload()

let editMode = false


let onkey = e => {
  let valid = [105, 111, 97, 65, 73, 79]
  if (valid.includes(e.keyCode)) {
    window.removeEventListener('keypress', onkey)
    //let filename = document.title.split("C<- ").pop()
    //janky and bad and has edgecases
    let pathname = document.location.pathname
    if (pathname === '/') pathname = '/index.md'
    pathname += '.raw'
    if (!editMode) {
      fetch(pathname).then(r => r.text()).then(text => {
        wrapper.innerHTML = `<textarea id="sandbox" style="width:100%; height:90vh;">${text}</textarea>`
        var vim = new VIM()

        /* log debug messages */
        vim.on_log = function(m){ console.log('VIM: '+m) }

        var target = document.getElementById('sandbox')
        if (target !== null) {
          /* attach vim. this is the only line really needed */
          vim.attach_to( target )
          target.focus()
          let lastkey = ''
          target.addEventListener('keypress', e => {
            console.log(lastkey, e.key, e.keyCode)
            lastkey += e.key
            lastkey = lastkey.slice(-2) 
            if (lastkey === ":w" || lastkey === ':W') {
              let body = target.value
              let path = pathname.split('.').slice(0,-1).join('.')
              fetch(path, {
                method: 'POST', // or 'PUT'
                headers: {
                  'Content-Type': 'text/markdown',
                },
                body,
              })
            }
          })
        }


      })
    } 
  }
}

window.addEventListener('keypress', onkey)
