#!/bin/bash

# Script para descargar y procesar datos reales de OpenData Euskadi
# Uso: ./descargar-datos-reales.sh

set -e  # Salir si hay error

echo "🚀 DESCARGANDO DATOS REALES DE OPENDATA EUSKADI"
echo "================================================"
echo ""

# URL de los datos
URL="https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson"

# Descargar
echo "📥 Descargando desde OpenData Euskadi..."
curl -L -o farmaziak-descargado.geojson "$URL"

# Verificar descarga
if [ ! -f farmaziak-descargado.geojson ]; then
    echo "❌ Error: No se pudo descargar el archivo"
    exit 1
fi

# Contar farmacias
FARMACIAS=$(grep -o '"type": "Feature"' farmaziak-descargado.geojson | wc -l)
echo "✅ Descargadas $FARMACIAS farmacias"
echo ""

# Procesar con Node.js
echo "⚙️  Procesando datos..."
node procesar-geojson.js

echo ""
echo "✅ ¡LISTO! Datos procesados correctamente"
echo ""
echo "🎉 SIGUIENTE PASO:"
echo "   npm start"
echo ""
echo "   Abre: http://localhost:4200"
echo ""
