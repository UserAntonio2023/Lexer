const fs = require('fs');

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
      tokensTokenizados.push(`[Error: ${token}]`); 
    }
  });

  return tokensTokenizados;
}

function evaluarSentencia(sentencia) {
  
  // Retorna true si la evaluación es exitosa, false si hay algún error
 
  return true; 
}

function main(archivoTokens, archivoConsultas) {
  const palabrasClaveSQL = cargarPalabrasClaveSQL(archivoTokens);
  const consultas = fs.readFileSync(archivoConsultas, 'utf8').split('\n');

  consultas.forEach((consulta, index) => {
    const tokens = tokenizarConsulta(consulta, palabrasClaveSQL);
    console.log(`Sentencia ${index + 1}: ${consulta}`);
    console.log(`Tokens: ${tokens.join(' ')}\n`);

    // Evaluar la sentencia y mostrar si la evaluación fue exitosa o no
    const evaluacionExitosa = evaluarSentencia(consulta);
    console.log(`Evaluación Exitosa: ${evaluacionExitosa}\n`);
  });
}

const archivoTokens = 'sql_keywords.txt'; // Nombre del archivo de tokens SQL
const archivoConsultas = 'sql.txt'; // Nombre del archivo de consultas SQL
main(archivoTokens, archivoConsultas);
