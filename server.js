const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {

    const file = request.url == '/' ? './www/landing.html' : `./www${request.url}`;

    fs.readFile(file, (err, data) => {
        if (err) {
            response.writeHead(404, {"Content-Type":"text/html"});
            response.write("Not Found");
            response.end();
        } else {
            const extension = file.split('.').pop();

            switch (extension) {
                case 'txt':
                    response.writeHead(200, {"Content-Type":"text/plain"});
                    break;
                case 'html':
                    response.writeHead(200, {"Content-Type":"text/html"});
                    break;
                case 'css':
                    response.writeHead(200, {"Content-Type":"text/css"});
                    break;
                case 'png':
                    response.writeHead(200, {"Content-Type":"image/png"});
                    break;
                case 'jpeg':
                case 'jpg':
                    response.writeHead(200, {"Content-Type":"image/jpeg"});
                    break;
                default:
                    response.writeHead(200 , {"Content-Type":"text/plain"});
            }

            response.write(data);
            response.end();
        }
    });

}).listen(8888);