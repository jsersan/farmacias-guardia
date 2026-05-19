# 🔧 SOLUCIÓN RÁPIDA - Las provincias no aparecen

## ❌ PROBLEMA
Ves "0 farmacias" y el dropdown de provincias está vacío.

## ✅ SOLUCIÓN EN 3 PASOS

### **PASO 1: Detener el servidor**
En la terminal donde está corriendo `npm start`, presiona:
```
Ctrl + C
```
(o Cmd + C en Mac)

### **PASO 2: Borrar caché de Angular**
```bash
rm -rf .angular
```

### **PASO 3: Volver a iniciar**
```bash
npm start
```

**¡Eso es todo!** Espera a que compile y abre:
```
http://localhost:4200
```

---

## 🎯 QUÉ DEBERÍAS VER AHORA

### En la consola del navegador (F12):
```
✅ 10 farmacias cargadas
```

### En el sidebar:
```
Filtros                    10 farmacias  ← Este número debe aparecer

PROVINCIA
▼ Araba / Álava        ← Debe aparecer en el dropdown
▼ Bizkaia
▼ Gipuzkoa
```

### En el mapa:
- Verás **10 pines de colores**
- Distribuidos en diferentes ciudades

---

## 🔍 SI AÚN NO APARECEN LAS FARMACIAS

### Opción A: Reinicio completo
```bash
# 1. Detener servidor (Ctrl+C)

# 2. Limpiar todo
rm -rf node_modules .angular package-lock.json

# 3. Reinstalar
npm install

# 4. Iniciar
npm start
```

### Opción B: Verificar que el archivo existe
```bash
# Ver si el archivo existe
ls -la src/assets/data/farmaziak.geojson

# Debería mostrar algo como:
# -rw-r--r-- 1 user user 5120 May 19 08:00 farmaziak.geojson
```

Si el archivo NO existe, descárgalo del ZIP y colócalo en:
```
src/assets/data/farmaziak.geojson
```

---

## 💡 ¿POR QUÉ PASA ESTO?

Angular cachea los archivos y no detecta automáticamente cuando agregas una nueva carpeta (`assets/data/`). 

**Soluciones:**
1. Reiniciar el servidor ✅
2. Borrar la caché de Angular ✅

---

## 🐛 MENSAJES DE ERROR COMUNES

### "Failed to load resource: assets/data/farmaziak.geojson"
**Solución:** El archivo no está en la ubicación correcta o no existe.
- Verifica que existe: `src/assets/data/farmaziak.geojson`
- Reinicia el servidor

### "✅ 0 farmacias cargadas"
**Solución:** El archivo se carga pero está vacío o tiene formato incorrecto.
- Reemplaza el archivo con el del ZIP
- Verifica que sea un archivo JSON válido

### No hay ningún mensaje en la consola
**Solución:** El servicio no se está ejecutando.
- Abre F12 → Console
- Recarga la página (F5)
- Debería aparecer algún mensaje

---

## 📝 COMANDOS RESUMIDOS

```bash
# Detener servidor
Ctrl + C

# Limpiar caché
rm -rf .angular

# Reiniciar
npm start

# Si no funciona, limpieza profunda:
rm -rf node_modules .angular package-lock.json
npm install
npm start
```

---

## ✅ RESULTADO ESPERADO

```
Console:
✅ 10 farmacias cargadas

Sidebar:
Filtros   10 farmacias

PROVINCIA
▼ Araba / Álava
▼ Bizkaia
▼ Gipuzkoa

Mapa:
🗺️ 10 pines visibles en diferentes ubicaciones
```

---

¿Sigue sin funcionar? Dime qué mensaje ves en la consola del navegador (F12 → Console).
