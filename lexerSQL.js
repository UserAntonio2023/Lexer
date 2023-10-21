const fs = require('fs');
const readline = require('readline');

const archivo = 'sql.txt';

// Verificamos si el archivo existe
if (!fs.existsSync(archivo)) {
    console.log(`El archivo ${archivo} no existe.`);
    return;
}

const rl = readline.createInterface({
    input: fs.createReadStream(archivo, 'utf8')
});

let sentencia = ''; // Variable para almacenar la sentencia SQL

rl.on('line', (line) => {
    // Eliminar espacios en blanco al principio y al final de la línea
    line = line.trim();

    // Comprobar si la línea no está vacía
    if (line.length > 0) {
        sentencia += line + ' '; // Agregar la línea a la sentencia
    }

    // Comprobar si la línea termina con punto y coma (fin de la sentencia)
    if (line.endsWith(';')) {
        console.log('\nSentencia:');
        console.log(sentencia); // Mostrar la sentencia
        sentencia = ''; // Reiniciar la variable para la próxima sentencia
    }
});

rl.on('close', () => {
    if (sentencia.trim() !== '') {
        console.log('\nSentencia:');
        console.log(sentencia); // Mostrar la última sentencia si no termina con punto y coma
    }
});
