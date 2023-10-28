const fs = require('fs');

// Funcion para cargar las palabras clave SQL desde un archivo de tokens
function cargarPalabrasClaveSQL(archivoTokens) {
  const palabrasClave = new Map();
  const contenido = fs.readFileSync(archivoTokens, 'utf8');
  const lineas = contenido.split('\n');
  lineas.forEach((linea) => {
    const [numero, palabra] = linea.split(': ');
    if (palabra) {
      palabrasClave.set(palabra.trim().toUpperCase(), numero);
    }
  });
  return palabrasClave;
}

// Funcion para tokenizar una consulta SQL
function tokenizarConsulta(consulta, palabrasClave) {
  const tokens = consulta.split(/\s+/);
  const tokensTokenizados = [];

  tokens.forEach((token) => {
    const tokenUpperCase = token.trim().toUpperCase();
    if (palabrasClave.has(tokenUpperCase)) {
      tokensTokenizados.push(`[${palabrasClave.get(tokenUpperCase)}: ${token}]`);
    } else if (/^\d+$/.test(token)) {
      tokensTokenizados.push(`[Número: ${token}]`);
    } else {
      tokensTokenizados.push(token);
    }
  });

  return tokensTokenizados.join(' ');
}

// Función principal
function main(archivoTokens, archivoConsultas) {
  const palabrasClaveSQL = cargarPalabrasClaveSQL(archivoTokens);
  const consultas = fs.readFileSync(archivoConsultas, 'utf8').split('\n');

  consultas.forEach((consulta, index) => {
    const consultaTokenizada = tokenizarConsulta(consulta, palabrasClaveSQL);
    console.log(`Sentencia ${index + 1}: ${consulta}`);
    console.log(`Tokens: ${consultaTokenizada}\n`);
  });
}

const archivoTokens = 'sql_keywords.txt'; // Nombre del archivo de tokens SQL
const archivoConsultas = 'sql.txt'; // Nombre del archivo de consultas SQL
main(archivoTokens, archivoConsultas);
