const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/') {
        let requestBody = '';

        request.on('data', (chunk) => {
            requestBody += chunk.toString();
        });

        request.on('end', () => {
            const datos = new URLSearchParams(requestBody);
            const datosJSON = {
                nombre: datos.get('nombre'),
                apellido: datos.get('apellido'),
                telefono: datos.get('telefono'),
                email: datos.get('email'),
                descripcion: datos.get('descripcion')
            };

            guardarContacto(datosJSON, (error) => {
                if (error) {
                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                    response.write('Error al guardar los datos');
                    response.end();
                } else {
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.write('Datos guardados correctamente');
                    response.end();
                }
            });
        });
    } else {
        const file = request.url == '/' ? './www/landing.html' : `./www${request.url}`;

        fs.readFile(file, (err, data) => {
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.write('Not Found');
                response.end();
            } else {
                const extension = file.split('.').pop();
                let contentType = '';

                switch (extension) {
                    case 'txt':
                        contentType = 'text/plain';
                        break;
                    case 'html':
                        contentType = 'text/html';
                        break;
                    case 'css':
                        contentType = 'text/css';
                        break;
                    case 'png':
                        contentType = 'image/png';
                        break;
                    case 'jpeg':
                    case 'jpg':
                        contentType = 'image/jpeg';
                        break;
                    default:
                        contentType = 'text/plain';
                }

                response.writeHead(200, { 'Content-Type': contentType });
                response.write(data);
                response.end();
            }
        });
    }
}).listen(8888);

function guardarContacto(datos, callback) {
    const archivo = './contactos.txt';
    const contenido = `Nombre: ${datos.nombre}\nApellido: ${datos.apellido}\nTeléfono: ${datos.telefono}\nEmail: ${datos.email}\nDescripción: ${datos.descripcion}\n\n`;

    fs.appendFile(archivo, contenido, (error) => {
        if (error) {
            callback(error);
        } else {
            callback(null);
        }
    });
}
