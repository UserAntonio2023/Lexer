/*Realizar un programa que analice un achivo, el cual contendrá sentencias SQL.
El programa leerá las sentencias y las mostrará separadas y en posición vertical,
respetando la sintaxis de SQL, incluyendo palabras reservadas, operadores, comillas, etc.
*/

const fs = require('fs');
const archivo = 'sql.txt';

// Verificamos si el archivo existe
if (!fs.existsSync(archivo)) {
    console.log(`El archivo ${archivo} no existe.`);
    return;
}

fs.readFile(archivo, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const sentencias = data.split(';'); // Dividir el archivo en sentencias SQL

    // Ciclo para recorrer las sentencias SQL
    for (let i = 0; i < sentencias.length; i++) {
        const sentencia = sentencias[i].trim();
        if (sentencia !== '') {
            console.log("\n");
            console.log("Sentencia " + (i + 1) + ": ");
            console.log(sentencia + ";"); // Agregar punto y coma al final
        }
    }
});
