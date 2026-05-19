# ⚡ GUÍA DE INSTALACIÓN RÁPIDA

## 📦 Paso 1: Descargar el proyecto

Ya tienes el archivo ZIP descargado. Descomprímelo en tu carpeta de proyectos.

```bash
unzip farmacias-guardia-euskadi.zip
cd farmacias-guardia
```

## 🔧 Paso 2: Instalar Node.js (si no lo tienes)

**Descarga Node.js desde:** https://nodejs.org/

Versión recomendada: **v16 o superior**

Verifica la instalación:
```bash
node --version
npm --version
```

## 📥 Paso 3: Instalar Angular CLI globalmente

```bash
npm install -g @angular/cli
```

Verifica:
```bash
ng version
```

## 🚀 Paso 4: Instalar dependencias del proyecto

```bash
npm install
```

**⏱️ Este paso puede tardar 2-5 minutos la primera vez.**

## ▶️ Paso 5: Ejecutar la aplicación

```bash
npm start
```

o también:

```bash
ng serve
```

## 🌐 Paso 6: Abrir en el navegador

Una vez que veas el mensaje:
```
✔ Compiled successfully.
** Angular Live Development Server is listening on localhost:4200 **
```

Abre tu navegador en:
```
http://localhost:4200
```

## ✅ ¡Listo!

La aplicación debería cargar y mostrar:
- ✅ Mapa de Euskadi
- ✅ Sidebar con filtros
- ✅ Cargando farmacias desde OpenData Euskadi

---

## 🐛 Solución de problemas comunes

### Error: "npm: command not found"
**Solución:** Instala Node.js desde https://nodejs.org/

### Error: "ng: command not found"
**Solución:** Ejecuta `npm install -g @angular/cli`

### Error: "Cannot find module..."
**Solución:** Ejecuta `npm install` en la carpeta del proyecto

### El mapa no aparece
**Solución:** 
1. Abre la consola del navegador (F12)
2. Verifica que no haya errores
3. Asegúrate de tener conexión a internet

### Las farmacias no se cargan
**Solución:**
1. Verifica tu conexión a internet
2. El servicio de OpenData Euskadi debe estar disponible
3. Revisa la consola del navegador para errores de CORS

---

## 📝 Comandos útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Construir para producción
npm run build

# Ver la versión de Angular
ng version

# Limpiar caché (si hay problemas)
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Primeros pasos tras la instalación

1. **Cambia el idioma**: Haz clic en ES/EU en la parte superior derecha
2. **Prueba los filtros**: Selecciona una provincia (ej: Gipuzkoa)
3. **Filtra por municipio**: Selecciona un municipio (ej: Donostia)
4. **Marca tipos de guardia**: Prueba con "Guardia 24 horas"
5. **Haz clic en un pin**: Ve la información detallada de la farmacia

---

## 📞 ¿Necesitas ayuda?

Si tienes problemas:
1. Revisa este documento completo
2. Verifica la consola del navegador (F12)
3. Comprueba que Node.js y npm estén instalados correctamente
4. Lee el archivo README.md para más detalles

---

**¡Disfruta usando la aplicación!** 🏥💚
