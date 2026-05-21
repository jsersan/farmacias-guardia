// server-proxy.js - VERSIÓN CORREGIDA PARA TXEMASERRANO.COM
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// URL de OpenData Euskadi
const OPENDATA_URL = 'https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson';
const CACHE_FILE = 'cache-farmaziak.json';

// ✅ CORS CONFIGURADO PARA TXEMASERRANO.COM
app.use(cors({
  origin: [
    'http://localhost:4200',                    // Desarrollo
    'http://localhost:3000',                    // Desarrollo proxy
    'https://txemaserrano.com',                 // ⬅️ Tu dominio principal
    'https://www.txemaserrano.com',             // ⬅️ Con www
    'http://txemaserrano.com',                  // ⬅️ Sin HTTPS (por si acaso)
    'http://www.txemaserrano.com',              // ⬅️ Sin HTTPS con www
    'https://*.github.io'                       // GitHub Pages
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Función para verificar si el cache es reciente (menos de 7 días)
function esCacheReciente() {
  if (!fs.existsSync(CACHE_FILE)) return false;
  
  const stats = fs.statSync(CACHE_FILE);
  const ahora = new Date();
  const edad = (ahora - stats.mtime) / 1000 / 60 / 60 / 24; // Edad en días
  
  return edad < 7; // Cache válido por 7 días
}

// Endpoint principal
app.get('/api/farmacias', async (req, res) => {
  console.log('\n════════════════════════════════════════════════════════');
  console.log('📥 NUEVA PETICIÓN DE FARMACIAS');
  console.log('════════════════════════════════════════════════════════');
  console.log('📍 Origen:', req.headers.origin || 'Sin origen');
  console.log('🕐 Timestamp:', new Date().toISOString());
  
  try {
    console.log('🌐 Intentando descargar desde OpenData Euskadi...');
    
    const response = await axios.get(OPENDATA_URL, {
      timeout: 30000,
      headers: {
        'Accept': 'application/json, application/geo+json',
        'User-Agent': 'Mozilla/5.0 (compatible; FarmaciasEuskadi/1.0)',
        'Accept-Language': 'es-ES,es;q=0.9,eu;q=0.8'
      },
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    
    // Manejar diferentes status codes
    if (response.status === 404) {
      console.error('❌ ERROR 404: URL no encontrada');
      throw new Error('404 Not Found');
    }
    
    if (response.status !== 200) {
      console.error(`❌ ERROR ${response.status}: ${response.statusText}`);
      throw new Error(`HTTP ${response.status}`);
    }
    
    if (!response.data || !response.data.features) {
      throw new Error('Respuesta inválida de OpenData');
    }
    
    console.log(`✅ Descarga exitosa: ${response.data.features.length} farmacias`);
    
    // Procesar datos
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
    
    // Guardar cache
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(response.data, null, 2));
      console.log('💾 Cache actualizado');
    } catch (cacheError) {
      console.warn('⚠️ No se pudo guardar cache:', cacheError.message);
    }
    
    // Enviar respuesta con headers CORS explícitos
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.json(response.data);
    console.log('✅ Respuesta enviada al cliente\n');
    
  } catch (error) {
    console.error('\n❌ ERROR AL DESCARGAR DATOS');
    console.error('════════════════════════════════════════════════════════');
    console.error('Mensaje:', error.message);
    
    // Intentar usar cache
    if (fs.existsSync(CACHE_FILE)) {
      const stats = fs.statSync(CACHE_FILE);
      const edadDias = Math.floor((new Date() - stats.mtime) / 1000 / 60 / 60 / 24);
      
      console.log('\n📂 USANDO CACHE LOCAL');
      console.log('════════════════════════════════════════════════════════');
      console.log('⏰ Edad del cache:', edadDias, 'días');
      console.log('🔄 Estado:', edadDias < 7 ? '✅ VÁLIDO' : '⚠️ ANTIGUO');
      
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      console.log('📊 Farmacias en cache:', cached.features ? cached.features.length : 0);
      
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('X-Cache-Used', 'true');
      res.header('X-Cache-Age-Days', edadDias.toString());
      res.json(cached);
      
      console.log('✅ Cache enviado al cliente\n');
    } else {
      console.error('\n💥 ERROR CRÍTICO: No hay cache disponible');
      res.status(500).json({
        error: 'No se pudieron cargar los datos',
        message: error.message,
        details: 'No hay cache disponible y OpenData no responde',
        timestamp: new Date().toISOString()
      });
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  const cacheExists = fs.existsSync(CACHE_FILE);
  let cacheAge = null;
  
  if (cacheExists) {
    const stats = fs.statSync(CACHE_FILE);
    cacheAge = Math.floor((new Date() - stats.mtime) / 1000 / 60 / 60 / 24);
  }
  
  res.json({
    status: 'ok',
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString(),
    port: PORT,
    cache: {
      available: cacheExists,
      ageDays: cacheAge,
      valid: cacheAge !== null && cacheAge < 7
    }
  });
});

// OPTIONS preflight para CORS
app.options('*', cors());

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  🚀 SERVIDOR PROXY DE FARMACIAS EUSKADI           ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  console.log(`   📍 URL: http://localhost:${PORT}`);
  console.log(`   📍 API: http://localhost:${PORT}/api/farmacias`);
  console.log(`   📍 Health: http://localhost:${PORT}/health`);
  console.log('\n   ✅ CORS configurado para:');
  console.log('      - http://localhost:4200 (desarrollo)');
  console.log('      - https://txemaserrano.com (producción)');
  console.log('      - https://www.txemaserrano.com (producción)');
  
  // Verificar cache al inicio
  if (fs.existsSync(CACHE_FILE)) {
    const stats = fs.statSync(CACHE_FILE);
    const edadDias = Math.floor((new Date() - stats.mtime) / 1000 / 60 / 60 / 24);
    console.log('\n   💾 Cache encontrado:');
    console.log(`      - Edad: ${edadDias} días`);
    console.log(`      - Estado: ${edadDias < 7 ? '✅ VÁLIDO' : '⚠️ ANTIGUO'}`);
    
    try {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      console.log(`      - Farmacias: ${cached.features ? cached.features.length : 0}`);
    } catch (e) {
      console.log('      - ⚠️ Error al leer cache');
    }
  } else {
    console.log('\n   ⚠️  No hay cache disponible');
    console.log('      - Se descargará en la primera petición');
  }
  
  console.log('\n');
});