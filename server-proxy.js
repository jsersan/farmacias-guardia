// server-proxy.js - Servidor proxy para descargar datos de OpenData Euskadi
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Habilitar CORS para localhost:4200
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Endpoint para descargar y servir el GeoJSON
app.get('/api/farmacias', async (req, res) => {
  try {
    console.log('📥 Descargando datos de OpenData Euskadi...');
    
    const response = await axios.get(
      'https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson',
      { timeout: 30000 }
    );
    
    console.log(`✅ Descargados ${response.data.features.length} farmacias`);
    
    // Procesar: añadir longitude y latitude
    response.data.features = response.data.features.map(feature => {
      const [longitude, latitude] = feature.geometry.coordinates;
      return {
        ...feature,
        properties: {
          ...feature.properties,
          longitude,
          latitude
        }
      };
    });
    
    // Guardar en archivo local (opcional, para cache)
    fs.writeFileSync('cache-farmaziak.json', JSON.stringify(response.data, null, 2));
    console.log('💾 Cache guardado en cache-farmaziak.json');
    
    // Enviar al cliente
    res.json(response.data);
    
  } catch (error) {
    console.error('❌ Error descargando datos:', error.message);
    
    // Intentar usar cache si existe
    if (fs.existsSync('cache-farmaziak.json')) {
      console.log('📂 Usando datos del cache...');
      const cached = JSON.parse(fs.readFileSync('cache-farmaziak.json', 'utf8'));
      res.json(cached);
    } else {
      res.status(500).json({ error: 'No se pudieron descargar los datos' });
    }
  }
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy funcionando' });
});

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║  🚀 SERVIDOR PROXY INICIADO                   ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  console.log(`   📍 URL: http://localhost:${PORT}`);
  console.log(`   📍 API: http://localhost:${PORT}/api/farmacias`);
  console.log('\n   ✅ Ahora ejecuta en otra terminal:');
  console.log('      cd farmacias-guardia');
  console.log('      npm start\n');
});
