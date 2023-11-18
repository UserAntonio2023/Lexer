const fs = require('fs');

// Función para cargar las palabras clave desde un archivo y devolver un mapa
function cargarPalabrasClaveSQL(archivoTokens) {
  const palabrasClave = new Map();
  const contenido = fs.readFileSync(archivoTokens, 'utf8');
  const lineas = contenido.split('\n');

  // Iterar sobre cada línea del archivo
  lineas.forEach((linea) => {
    const [numero, palabra] = linea.split(': ');

    // Añadir la palabra clave al mapa si existe
    if (palabra) {
      palabrasClave.set(palabra.trim().toUpperCase(), numero);
    }
  });

  return palabrasClave;
}

// Función para tokenizar una consulta usando las palabras clave proporcionadas
function tokenizarConsulta(consulta, palabrasClave) {
  const tokens = consulta.split(/\s+/);
  const tokensTokenizados = [];

  // Iterar sobre cada token en la consulta
  tokens.forEach((token) => {
    const tokenUpperCase = token.trim().toUpperCase();

    // Verificar si el token es una palabra clave
    if (palabrasClave.has(tokenUpperCase)) {
      tokensTokenizados.push(`[${palabrasClave.get(tokenUpperCase)}: ${token}]`);
    } else if (/^\d+$/.test(token)) {
      // Verificar si el token es un número
      tokensTokenizados.push(`[Número: ${token}]`);
    } else {
      // Si no es una palabra clave ni un número, se considera un error
      tokensTokenizados.push(`[Error: ${token}]`);
    }
  });

  return tokensTokenizados;
}

// Función para evaluar una sentencia usando un validador de reglas sintácticas
function evaluarSentencia(consulta, reglasSintacticas) {
  const tokens = consulta.split(/\s+/);

  // Verificar si los tokens cumplen con las reglas sintácticas
  for (const regla in reglasSintacticas) {
    const reglaTokens = reglasSintacticas[regla];
    if (tokens.length === reglaTokens.length) {
      let esValida = true;
      for (let i = 0; i < tokens.length; i++) {
        if (parseInt(tokens[i]) !== reglaTokens[i]) {
          esValida = false;
          break;
        }
      }
      if (esValida) {
        console.log(`La regla sintáctica ${regla} es válida.`);
        return true;
      }
    }
  }

  console.log("No se cumple ninguna regla sintáctica.");
  return false;
}

// Función principal que carga las palabras clave, lee las consultas y las procesa
function main(archivoTokens, archivoConsultas) {
  const palabrasClaveSQL = cargarPalabrasClaveSQL(archivoTokens);
  const reglasSintacticas = {
    "SELECT": [655],  
    
  };

  const consultas = fs.readFileSync(archivoConsultas, 'utf8').split('\n');

  // Iterar sobre cada consulta en el archivo
  consultas.forEach((consulta, index) => {
    const tokens = tokenizarConsulta(consulta, palabrasClaveSQL);
    console.log(`Sentencia ${index + 1}: ${consulta}`);
    console.log(`Tokens: ${tokens.join(' ')}\n`);

    // Evaluar la sentencia y mostrar si la evaluación fue exitosa o no
    const evaluacionExitosa = evaluarSentencia(consulta, reglasSintacticas);
    console.log(`Evaluación Exitosa: ${evaluacionExitosa}\n`);
  });
}

// Nombres de los archivos de entrada
const archivoTokens = 'sql_keywords.txt'; // Nombre del archivo de tokens SQL
const archivoConsultas = 'sql.txt'; // Nombre del archivo de consultas SQL

// Llamada a la función principal
main(archivoTokens, archivoConsultas);
