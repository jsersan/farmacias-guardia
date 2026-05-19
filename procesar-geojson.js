const fs = require('fs');

console.log('═══════════════════════════════════════════════════');
console.log('📖 PROCESANDO DATOS DE OPENDATA EUSKADI');
console.log('═══════════════════════════════════════════════════\n');

// Verificar que existe el archivo descargado
if (!fs.existsSync('farmaziak-descargado.geojson')) {
  console.error('❌ Error: No se encuentra farmaziak-descargado.geojson');
  console.log('\n💡 SOLUCIÓN:');
  console.log('   1. Abre en tu navegador:');
  console.log('      https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson');
  console.log('   2. Guarda como: farmaziak-descargado.geojson');
  console.log('   3. Ejecuta de nuevo: node procesar-geojson.js\n');
  process.exit(1);
}

console.log('📖 Leyendo archivo descargado...');
const data = JSON.parse(fs.readFileSync('farmaziak-descargado.geojson', 'utf8'));

const totalFarmacias = data.features.length;
console.log(`✅ Archivo cargado: ${totalFarmacias} farmacias\n`);

console.log('⚙️  Procesando y añadiendo coordenadas...');

// Contadores por provincia
const stats = {
  'Araba / Álava': { farmacias: 0, municipios: new Set() },
  'Bizkaia': { farmacias: 0, municipios: new Set() },
  'Gipuzkoa': { farmacias: 0, municipios: new Set() }
};

// Procesar cada farmacia
data.features = data.features.map((feature, index) => {
  const [longitude, latitude] = feature.geometry.coordinates;
  
  // Progreso cada 100 farmacias
  if ((index + 1) % 100 === 0) {
    console.log(`   ⚙️ Procesadas ${index + 1}/${totalFarmacias}...`);
  }
  
  // Normalizar nombres de campos
  const props = feature.properties;
  const territory = props.territory || props.territorio || props.type || '';
  const municipality = props.municipality || props.municipio || '';
  
  // Estadísticas
  if (stats[territory]) {
    stats[territory].farmacias++;
    if (municipality) {
      stats[territory].municipios.add(municipality);
    }
  }
  
  return {
    ...feature,
    properties: {
      ...props,
      longitude,
      latitude
    }
  };
});

// Guardar archivo procesado
console.log('\n💾 Guardando archivo procesado...');
fs.writeFileSync('src/assets/data/farmaziak.geojson', JSON.stringify(data, null, 2));

console.log('\n═══════════════════════════════════════════════════');
console.log('✅ ¡PROCESAMIENTO COMPLETADO!');
console.log('═══════════════════════════════════════════════════\n');

console.log('📊 ESTADÍSTICAS:\n');
Object.keys(stats).forEach(provincia => {
  const { farmacias, municipios } = stats[provincia];
  console.log(`   ${provincia}:`);
  console.log(`      • ${farmacias} farmacias`);
  console.log(`      • ${municipios.size} municipios`);
  console.log('');
});

console.log(`📍 Total: ${totalFarmacias} farmacias en ${stats['Araba / Álava'].municipios.size + stats['Bizkaia'].municipios.size + stats['Gipuzkoa'].municipios.size} municipios`);
console.log(`📍 Archivo guardado: src/assets/data/farmaziak.geojson\n`);

console.log('🚀 SIGUIENTE PASO:');
console.log('   npm start\n');
console.log('   Abre: http://localhost:4200\n');
