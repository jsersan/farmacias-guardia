# 🚀 GUÍA RÁPIDA: CARGAR TODOS LOS DATOS REALES

## ⚡ OPCIÓN 1: AUTOMÁTICA (30 segundos)

### **Para Linux/Mac:**
```bash
chmod +x descargar-datos-reales.sh
./descargar-datos-reales.sh
npm start
```

### **Para Windows (PowerShell):**
```powershell
# Descargar datos
Invoke-WebRequest -Uri "https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson" -OutFile "farmaziak-descargado.geojson"

# Procesar
node procesar-geojson.js

# Ejecutar
npm start
```

---

## 📱 OPCIÓN 2: MANUAL (más fácil)

### **Paso 1: Descargar archivo** (15 segundos)

1. **Abre este enlace en tu navegador:**
   ```
   https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson
   ```

2. **Guarda el archivo:**
   - Si se descarga automáticamente → Genial ✅
   - Si se abre en el navegador:
     - **Chrome/Edge:** `Ctrl+S` → Guardar como → `farmaziak-descargado.geojson`
     - **Firefox:** `Ctrl+S` → Guardar página → `farmaziak-descargado.geojson`
     - **Safari:** `Cmd+S` → Guardar → `farmaziak-descargado.geojson`

3. **Mueve el archivo a la carpeta del proyecto**
   - Pon `farmaziak-descargado.geojson` en la misma carpeta donde está `package.json`

### **Paso 2: Procesar datos** (10 segundos)

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
node procesar-geojson.js
```

Verás algo como:
```
═══════════════════════════════════════════════════
📖 PROCESANDO DATOS DE OPENDATA EUSKADI
═══════════════════════════════════════════════════

📖 Leyendo archivo descargado...
✅ Archivo cargado: 567 farmacias

⚙️  Procesando y añadiendo coordenadas...
   ⚙️ Procesadas 100/567...
   ⚙️ Procesadas 200/567...
   ⚙️ Procesadas 300/567...
   ⚙️ Procesadas 400/567...
   ⚙️ Procesadas 500/567...

💾 Guardando archivo procesado...

═══════════════════════════════════════════════════
✅ ¡PROCESAMIENTO COMPLETADO!
═══════════════════════════════════════════════════

📊 ESTADÍSTICAS:

   Araba / Álava:
      • 89 farmacias
      • 51 municipios

   Bizkaia:
      • 287 farmacias
      • 112 municipios

   Gipuzkoa:
      • 191 farmacias
      • 88 municipios

📍 Total: 567 farmacias en 251 municipios
📍 Archivo guardado: src/assets/data/farmaziak.geojson

🚀 SIGUIENTE PASO:
   npm start
```

### **Paso 3: ¡Disfrutar!** (5 segundos)

```bash
npm start
```

Abre: `http://localhost:4200`

---

## ✅ RESULTADO ESPERADO

### **Antes (datos de ejemplo):**
```
4 farmacias
2 municipios en Gipuzkoa
```

### **Después (datos reales):**
```
567+ farmacias
251 municipios
  • Araba/Álava: 51 municipios
  • Bizkaia: 112 municipios
  • Gipuzkoa: 88 municipios
```

---

## 🎯 VERIFICACIÓN

Cuando abras la aplicación deberías ver:

### **Sidebar:**
```
Filtros    567 farmacias  ← ✅ Más de 500

PROVINCIA
▼ Araba / Álava
▼ Bizkaia
▼ Gipuzkoa

MUNICIPIO (ejemplo Gipuzkoa)
▼ Todos
  Donostia-San Sebastián
  Eibar
  Irun
  Zarautz
  Getaria
  Errenteria
  Hondarribia
  ... y 80+ más  ← ✅ Muchos municipios
```

### **Mapa:**
- ✅ Cientos de pines por toda Euskadi
- ✅ Todos los municipios disponibles
- ✅ Datos reales: nombres, direcciones, teléfonos

---

## ❓ SOLUCIÓN DE PROBLEMAS

### **Error: "Cannot find module 'fs'"**
```bash
# Ejecuta desde la carpeta del proyecto:
cd farmacias-guardia
node procesar-geojson.js
```

### **Error: "farmaziak-descargado.geojson not found"**
```bash
# Asegúrate de que el archivo está en la carpeta correcta:
ls farmaziak-descargado.geojson

# Si no está, descárgalo de nuevo
```

### **Solo aparecen 4 farmacias después de procesar**
```bash
# Verifica que descargaste el archivo correcto:
wc -l farmaziak-descargado.geojson

# Debería tener más de 10,000 líneas
# Si tiene pocas líneas, descárgalo de nuevo
```

---

## 🔄 ACTUALIZAR DATOS (cada 1-3 meses)

```bash
# 1. Descargar archivo actualizado
# 2. Ejecutar:
node procesar-geojson.js

# 3. Listo
npm start
```

---

## 📸 CAPTURA DE PANTALLA ESPERADA

Deberías ver algo así:

```
┌─────────────────────────────┐
│ Filtros       567 farmacias │
│                             │
│ PROVINCIA                   │
│ ▼ Gipuzkoa                  │
│                             │
│ MUNICIPIO                   │
│ ▼ Donostia-San Sebastián    │
│   Eibar                     │
│   Irun                      │
│   Zarautz                   │
│   Getaria                   │
│   Errenteria                │
│   Hondarribia               │
│   Hernani                   │
│   Lasarte-Oria              │
│   Andoain                   │
│   Tolosa                    │
│   Beasain                   │
│   ... (75+ más)             │
└─────────────────────────────┘
```

Y el mapa **lleno de pines por toda Euskadi**.

---

**¿Necesitas ayuda con algún paso? ¡Dímelo!** 🚀
