const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const https = require('https')
const unirest = require('unirest')

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

// unirest.post("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0")
// .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
// .header("X-RapidAPI-Key", "85397e8c0amsh409a2e3be20fce1p18f7c7jsnde35283a8ffb")
// .header("Content-Type", "application/x-www-form-urlencoded")
// .send("inboundDate=2019-09-10")
// .send("cabinClass=business")
// .send("children=0")
// .send("infants=0")
// .send("country=US")
// .send("currency=USD")
// .send("locale=en-US")
// .send("originPlace=SFO-sky")
// .send("destinationPlace=LHR-sky")
// .send("outboundDate=2019-09-01")
// .send("adults=1")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });

// unirest.get("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/SFO-sky/JFK-sky/2019-09-01?inboundpartialdate=2019-09-01")
// .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
// .header("X-RapidAPI-Key", "85397e8c0amsh409a2e3be20fce1p18f7c7jsnde35283a8ffb")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });

console.log(`Server listening on port ${port}`)