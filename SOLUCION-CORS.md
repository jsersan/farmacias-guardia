# 🔧 SOLUCIÓN AL ERROR DE CORS

## ❌ El Error que estabas viendo

```
HttpErrorResponse: Http failure response for 
https://opendata.euskadi.eus/.../farmaziak.geojson: 0 Unknown Error

Failed to load resource: net::ERR_CERT_AUTHORITY_INVALID
Access to XMLHttpRequest has been blocked by CORS policy
```

## ✅ SOLUCIÓN APLICADA

He modificado el servicio para usar un **proxy CORS** que soluciona el problema.

### Lo que cambió en `farmacias.service.ts`:

**ANTES:**
```typescript
private readonly GEOJSON_URL = 'https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson';
```

**AHORA:**
```typescript
private readonly GEOJSON_URL = 'https://api.allorigins.win/raw?url=' + 
  encodeURIComponent('https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson');
```

## 🚀 CÓMO ACTUALIZAR TU PROYECTO

### Opción 1: Descargar el archivo actualizado

1. Descarga el nuevo ZIP que te proporcionaré
2. Extrae y reemplaza la carpeta `src/app/services/`
3. Ejecuta:
```bash
npm start
```

### Opción 2: Modificar manualmente

Abre el archivo `src/app/services/farmacias.service.ts` y busca la línea:

```typescript
private readonly GEOJSON_URL = 'https://opendata.euskadi.eus/...';
```

Reemplázala por:

```typescript
private readonly GEOJSON_URL = 'https://api.allorigins.win/raw?url=' + 
  encodeURIComponent('https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson');
```

Guarda el archivo y la aplicación se recargará automáticamente.

---

## 🔄 PROXIES CORS ALTERNATIVOS

Si `allorigins.win` no funciona, prueba estas alternativas:

### Opción A: corsproxy.io
```typescript
private readonly GEOJSON_URL = 'https://corsproxy.io/?' + 
  encodeURIComponent('https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson');
```

### Opción B: cors-anywhere (requiere tu propio servidor)
```typescript
private readonly GEOJSON_URL = 'https://cors-anywhere.herokuapp.com/' + 
  'https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson';
```

### Opción C: Descargar datos y servirlos localmente

1. Descarga el GeoJSON manualmente desde tu navegador:
   ```
   https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson
   ```

2. Guárdalo en `src/assets/data/farmaziak.geojson`

3. Modifica el servicio:
   ```typescript
   private readonly GEOJSON_URL = 'assets/data/farmaziak.geojson';
   ```

---

## 🎯 VERIFICAR QUE FUNCIONA

Después de aplicar la solución:

1. Abre la consola del navegador (F12)
2. Recarga la página
3. Deberías ver:
   ```
   ✅ X farmacias cargadas
   ```
4. El sidebar mostrará las provincias disponibles
5. El mapa mostrará los pines de las farmacias

---

## 🐛 SI AÚN NO FUNCIONA

### Paso 1: Limpia la caché
```bash
# Detén el servidor (Ctrl+C)
# Limpia node_modules
rm -rf node_modules package-lock.json
npm install
npm start
```

### Paso 2: Verifica la consola
Abre F12 → Console y busca:
- ❌ Errores en rojo
- ✅ Mensajes de éxito en verde

### Paso 3: Prueba en modo incógnito
A veces el caché del navegador causa problemas.

### Paso 4: Verifica tu conexión a internet
El proxy necesita conexión para funcionar.

---

## 📝 ¿POR QUÉ OCURRE ESTE ERROR?

**CORS (Cross-Origin Resource Sharing)** es una medida de seguridad de los navegadores que bloquea peticiones entre diferentes dominios:

- Tu app: `http://localhost:4200`
- API: `https://opendata.euskadi.eus`

Como son dominios diferentes, el navegador bloquea la petición a menos que el servidor lo permita explícitamente.

**Soluciones:**

1. ✅ **Proxy CORS** (lo que hemos hecho) - Redirige la petición a través de un servidor intermedio
2. ✅ **Datos locales** - Descarga el archivo y sírvelo desde tu proyecto
3. ❌ **Modificar servidor** - No podemos, porque no controlamos opendata.euskadi.eus

---

## 🎉 RESULTADO ESPERADO

Después de aplicar la solución verás:

```
Filtros                        0 farmacias → Cambiará a número real

PROVINCIA
✓ Araba / Álava
✓ Bizkaia
✓ Gipuzkoa

MUNICIPIO
[Se habilitará cuando selecciones provincia]

TIPO DE GUARDIA
☐ Guardia Diurna
☐ Guardia Nocturna
☐ Guardia 24 horas
☐ Días Laborables
☐ Días Festivos
```

Y el mapa mostrará los pines de las farmacias.

---

¿Necesitas ayuda? ¡Avísame y te guío paso a paso!
