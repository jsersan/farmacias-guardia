# 🚀 DESCARGA AUTOMÁTICA CON PROXY LOCAL

## ✅ **SOLUCIÓN DEFINITIVA AL PROBLEMA DE CORS**

Este proxy local descarga automáticamente los datos reales de OpenData Euskadi **sin restricciones de CORS**.

---

## 🎯 **CÓMO FUNCIONA**

```
OpenData Euskadi
    ↓
Proxy Local (Node.js en puerto 3000)
    ↓
Angular (localhost:4200)
    ↓
✅ SIN PROBLEMAS DE CORS
```

---

## 🚀 **USO RÁPIDO (1 COMANDO)**

### **Opción 1: Todo automático**
```bash
npm install
npm run dev
```

Esto ejecuta:
- ✅ **Proxy** en `http://localhost:3000`
- ✅ **Angular** en `http://localhost:4200`
- ✅ **Descarga automática** de datos reales

---

### **Opción 2: Terminales separadas**

**Terminal 1 (Proxy):**
```bash
npm install
npm run proxy
```

**Terminal 2 (Angular):**
```bash
npm start
```

---

## 📊 **RESULTADO ESPERADO**

### **Terminal del Proxy:**
```
╔════════════════════════════════════════════════╗
║  🚀 SERVIDOR PROXY INICIADO                   ║
╚════════════════════════════════════════════════╝

   📍 URL: http://localhost:3000
   📍 API: http://localhost:3000/api/farmacias

   ✅ Ahora ejecuta en otra terminal:
      cd farmacias-guardia
      npm start

📥 Descargando datos de OpenData Euskadi...
✅ Descargados 567 farmacias
💾 Cache guardado en cache-farmaziak.json
```

### **Navegador:**
```
Filtros    567 farmacias  ← ✅ TODOS LOS DATOS

PROVINCIA: Todas
  • Araba / Álava (89 farmacias)
  • Bizkaia (287 farmacias)
  • Gipuzkoa (191 farmacias)

MUNICIPIOS: 251 en total
```

---

## 💾 **CACHE AUTOMÁTICO**

El proxy guarda los datos en `cache-farmaziak.json`:

**Ventajas:**
- ✅ Si OpenData Euskadi está caído, usa el cache
- ✅ Descarga más rápida en futuras ejecuciones
- ✅ Funciona offline después de la primera descarga

**Para forzar descarga nueva:**
```bash
rm cache-farmaziak.json
npm run dev
```

---

## 🔍 **VERIFICAR QUE FUNCIONA**

### **1. Proxy funcionando:**
Abre en el navegador:
```
http://localhost:3000/health
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "Proxy funcionando"
}
```

### **2. Datos descargados:**
Abre en el navegador:
```
http://localhost:3000/api/farmacias
```

Deberías ver el JSON con 567 farmacias.

### **3. Aplicación funcionando:**
```
http://localhost:4200
```

Debería mostrar **567 farmacias** en el contador.

---

## ❓ **SOLUCIÓN DE PROBLEMAS**

### **Error: "Cannot find module 'express'"**
```bash
npm install
```

### **Error: "Port 3000 already in use"**
```bash
# Cambiar puerto en server-proxy.js:
const PORT = 3001;  // o cualquier otro puerto libre

# Y actualizar en farmacias.service.ts:
private readonly GEOJSON_URL = 'http://localhost:3001/api/farmacias';
```

### **Error: "ECONNREFUSED localhost:3000"**
```bash
# El proxy no está ejecutándose
# Inicia el proxy primero:
npm run proxy

# Luego en otra terminal:
npm start
```

### **Solo aparecen 10 farmacias después de iniciar**
```bash
# Verifica que el proxy está funcionando:
curl http://localhost:3000/api/farmacias | head -50

# Verifica la URL en farmacias.service.ts:
# Debe ser: http://localhost:3000/api/farmacias
# NO: assets/data/farmaziak.geojson
```

---

## 🎯 **COMANDOS ÚTILES**

### **Desarrollo normal:**
```bash
npm run dev
```

### **Ver logs del proxy:**
```bash
npm run proxy
```

### **Limpiar cache:**
```bash
rm cache-farmaziak.json
```

### **Verificar descarga:**
```bash
curl http://localhost:3000/api/farmacias | jq '.features | length'
# Debería mostrar: 567 (o similar)
```

---

## 🔄 **ACTUALIZAR DATOS**

Los datos se actualizan automáticamente en cada reinicio del proxy.

Para forzar actualización:
```bash
rm cache-farmaziak.json
npm run dev
```

---

## 📦 **DEPENDENCIAS AÑADIDAS**

```json
{
  "dependencies": {
    "express": "^4.18.2",    // Servidor HTTP
    "cors": "^2.8.5",        // Habilitar CORS
    "axios": "^1.6.0"        // Descargar datos
  },
  "devDependencies": {
    "concurrently": "^8.2.0" // Ejecutar proxy + Angular
  }
}
```

---

## ✅ **VENTAJAS DE ESTA SOLUCIÓN**

| Característica | Manual | Proxy Local |
|----------------|--------|-------------|
| Descarga automática | ❌ | ✅ |
| Sin CORS | ❌ | ✅ |
| Actualización fácil | ❌ | ✅ |
| Cache automático | ❌ | ✅ |
| Funciona offline | ❌ | ✅ |
| Un solo comando | ❌ | ✅ |

---

## 🎉 **RESUMEN**

```bash
# 1. Instalar
npm install

# 2. Ejecutar
npm run dev

# 3. Abrir
http://localhost:4200

# ✅ ¡567+ farmacias automáticamente!
```

---

**¿Necesitas ayuda? ¡Pregúntame!** 🚀
