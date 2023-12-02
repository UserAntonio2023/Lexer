//Al escribir en sql.txt se tiene que escribir de esta manera -CREATE TABLE persons ; #el punto y coma separado

// Importamos el modulo 'fs' 
const fs = require('fs');

// Funcion para cargar las palabras clave SQL 
function cargarPalabrasClaveSQL(archivoTokens) {
  //nuevo mapa para almacenar las palabras clave junto con sus números asociados
  const palabrasClave = new Map();
  // Leemos el contenido del archivo de tokens.
  const contenido = fs.readFileSync(archivoTokens, 'utf8');
  // Dividimos el contenido en lineas.
  const lineas = contenido.split('\n');

  // Iteramos sobre cada línea del archivo de tokens.
  lineas.forEach((linea) => {
    // Dividimos cada línea en número y palabra clave.
    const [numero, palabra] = linea.split(': ');
    // Verificamos si hay una palabra clave presente.
    if (palabra) {
      // Almacenamos la palabra clave  junto con su numero asociado en el mapa.
      palabrasClave.set(palabra.trim().toUpperCase(), parseInt(numero));
    }
  });

  // Devolvemos el mapa de palabras clave.
  return palabrasClave;
}

// Función para tokenizar una consulta SQL dada, utilizando el mapa de palabras clave.
function tokenizarConsulta(consulta, palabrasClave) {
  // Dividimos la consulta en tokens usando expresiones regulares y eliminamos tokens vacíos.
  const tokens = consulta.split(/\s+/).filter(token => token !== '');
  // Creamos un array para almacenar los tokens tokenizados.
  const tokensTokenizados = [];

  // Iteramos sobre cada token en la consulta.
  tokens.forEach((token) => {
    // Convertimos el token a mayusculas para hacer la búsqueda en el mapa de palabras clave.
    const tokenUpperCase = token.trim().toUpperCase();

    // Verificamos si el token esta presente en el mapa de palabras clave.
    if (palabrasClave.has(tokenUpperCase)) {
      // Agregamos al array el token con el formato [Número : Token].
      tokensTokenizados.push(`[${palabrasClave.get(tokenUpperCase)} : ${token}]`);
    } else {
      // Si el token no esta en el mapa lo marcamos como un error 
      tokensTokenizados.push(`[Error de sintaxis : ${token}]`);
    }
  });

  // Devolvemos el array de tokens tokenizados.
  return tokensTokenizados;
}

// Funcion principal que carga las palabras clave, tokeniza las consultas y escribe el resultado en un archivo LOG.TXT.
function main(archivoTokens, archivoConsultas) {
  // Cargamos las palabras clave SQL 
  const palabrasClaveSQL = cargarPalabrasClaveSQL(archivoTokens);
  // Leemos las consultas desde el archivo de consultas.
  const consultas = fs.readFileSync(archivoConsultas, 'utf8').split('\n');
  // Creamos un array para almacenar el contenido del log.
  const logContent = [];

  // Iteramos sobre cada consulta.
  consultas.forEach((consulta, index) => {
    // Tokenizamos la consulta usando las palabras clave cargadas.
    const tokens = tokenizarConsulta(consulta, palabrasClaveSQL);
    // Agregamos la información al array del log.
    logContent.push(`Sentencia ${index + 1}: ${consulta}`);
    logContent.push(`Tokens: ${tokens.join(' ')}\n`);
  });

  // Escribimos el contenido del log en el archivo LOG.TXT.
  fs.writeFileSync('LOG.TXT', logContent.join('\n'), 'utf8');
}

// Nombres de los archivos de entrada.
const archivoTokens = 'sql_keywords.txt';
const archivoConsultas = 'sql.txt';

// Llamamos a la función principal para ejecutar el proceso.
main(archivoTokens, archivoConsultas);
