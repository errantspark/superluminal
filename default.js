  let host = "ws://"+window.location.host
console.log("connecting to server @ "+host)
let socket = new WebSocket(host)
socket.onmessage = () => location.reload()

