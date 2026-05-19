# 📥 CÓMO OBTENER LOS DATOS REALES DE FARMACIAS

## 🎯 SITUACIÓN ACTUAL

Tu aplicación ahora usa **datos de ejemplo** (10 farmacias) que funcionan **sin problemas de CORS**.

Para tener **todas las farmacias reales de Euskadi**, necesitas descargar el archivo GeoJSON desde tu navegador.

---

## ✅ PASO 1: Descargar el archivo GeoJSON

### Opción A: Desde tu navegador

1. **Abre esta URL en tu navegador:**
   ```
   https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson
   ```

2. **El archivo se descargará automáticamente** o se abrirá en una pestaña

3. Si se abre en el navegador:
   - **Chrome/Edge**: Clic derecho → "Guardar como..."
   - **Firefox**: Clic derecho → "Guardar página como..."
   - **Safari**: Archivo → Guardar como...

4. **Guarda el archivo como:** `farmaziak.geojson`

---

## ✅ PASO 2: Colocar el archivo en tu proyecto

1. **Ve a tu proyecto:**
   ```
   farmacias-guardia/src/assets/data/
   ```

2. **Reemplaza el archivo existente** `farmaziak.geojson` con el que descargaste

3. **Eso es todo** - La aplicación se recargará automáticamente

---

## ✅ PASO 3: Verificar que funciona

Después de reemplazar el archivo:

1. **La aplicación se recarga**
2. **Verás en consola:**
   ```
   ✅ 500+ farmacias cargadas
   ```
   (El número exacto depende de los datos actuales)

3. **El mapa mostrará muchos más pines** por todo Euskadi

---

## 🔄 ACTUALIZAR DATOS REGULARMENTE

Si quieres tener los datos más recientes:

### 1. Descarga el archivo actualizado:
   ```
   https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson
   ```

### 2. Reemplaza el archivo en:
   ```
   src/assets/data/farmaziak.geojson
   ```

### 3. Recarga la aplicación

**Recomendación:** Actualiza los datos cada mes o cuando necesites información reciente.

---

## 🤔 ¿POR QUÉ USAR DATOS LOCALES?

### Ventajas:
- ✅ **Sin errores CORS** - Funciona siempre
- ✅ **Más rápido** - No depende de servidores externos
- ✅ **Funciona offline** - Una vez cargado
- ✅ **Más estable** - No falla si el servidor externo cae

### Desventajas:
- ❌ No se actualiza automáticamente (debes hacerlo manualmente)

---

## 🔧 ALTERNATIVA: Usar un proxy (datos en tiempo real)

Si prefieres que la app descargue los datos directamente (con riesgo de CORS):

### Edita `src/app/services/farmacias.service.ts`:

**Busca la línea 13:**
```typescript
private readonly GEOJSON_URL = 'assets/data/farmaziak.geojson';
```

**Cámbiala por:**
```typescript
private readonly GEOJSON_URL = 'https://corsproxy.io/?' + 
  encodeURIComponent('https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson');
```

**Nota:** Los proxies pueden fallar o estar caídos. Usar datos locales es más confiable.

---

## 📊 ESTRUCTURA DEL ARCHIVO GEOJSON

El archivo que descargues tendrá esta estructura:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-1.9812, 43.3213]
      },
      "properties": {
        "documentName": "Nombre de la Farmacia",
        "address": "Dirección completa",
        "municipality": "Municipio",
        "territory": "Provincia",
        "phone": "Teléfono",
        "turno": "Tipo de guardia",
        "email": "email@farmacia.com"
      }
    }
    // ... más farmacias
  ]
}
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### El mapa sigue vacío después de reemplazar el archivo

**Solución:**
1. Verifica que el archivo esté en: `src/assets/data/farmaziak.geojson`
2. Detén el servidor (Ctrl+C)
3. Vuelve a ejecutar: `npm start`

### No puedo descargar el archivo desde el navegador

**Solución:**
1. Intenta desde otro navegador (Chrome, Firefox, Safari)
2. Desactiva temporalmente extensiones de seguridad/privacidad
3. Intenta desde otra red (datos móviles, otra WiFi)

### El archivo descargado está vacío o tiene error

**Solución:**
- El servicio de OpenData Euskadi puede estar temporalmente caído
- Espera unos minutos y vuelve a intentarlo
- Mientras tanto, usa los datos de ejemplo que ya están en el proyecto

---

## 💡 RECOMENDACIÓN FINAL

**Para desarrollo y testing:**
→ Usa los datos locales de ejemplo (10 farmacias) ✅

**Para producción:**
→ Descarga los datos reales y actualízalos mensualmente 📅

**Para datos en tiempo real:**
→ Necesitarás un backend propio que sirva de proxy (más avanzado) 🚀

---

¿Necesitas ayuda? ¡Pregúntame!
