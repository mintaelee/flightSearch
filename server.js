const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

const port = process.argv[2] || 8000
console.log('argv: ', process.argv)

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text.css',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/font-sfnt'
}

http.createServer(function(req, res){
    console.log(`${req.method} ${req.url}`)

    const parsedURL = url.parse(req.url)

    // Avoid Directory traversal attacks
    const sanitizePath = path.normalize(parsedURL.pathname).replace(/^(\.\.[\/\\])+/, '')
    let pathname = path.join(__dirname, sanitizePath)

    fs.exists(pathname, function(exist) {
        if (!exist) {
            res.statusCode = 404
            res.end(`File ${pathname} not found!`)

            return
        }

        if(fs.statSync(pathname).isDirectory()) pathname += '/index.html'

        fs.readFile(pathname, function(err, data) {
            if(err){
                res.statusCode = 500
                res.end("Error getting the file")
                console.log(`Error getting the file: ${err}`)
            } else {
                const ext = path.parse(pathname).ext

                res.setHeader('Content-type', mimeType[ext] || 'text/plain')
                res.end(data)
            }
        })
    })
}).listen(parseInt(port))

console.log(`Server listening on port ${port}`)