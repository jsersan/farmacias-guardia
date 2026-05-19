# 📋 GUÍA DE USO Y DOCUMENTACIÓN TÉCNICA

## 🎯 Resumen del proyecto

Esta aplicación es un buscador interactivo de farmacias de guardia en Euskadi, desarrollado con Angular 15 y OpenLayers. Los datos se obtienen en tiempo real desde el portal de OpenData Euskadi.

---

## 🚀 INICIO RÁPIDO

### 1. Instalación

```bash
# Clonar repositorio
git clone [tu-repositorio]
cd farmacias-guardia

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start
```

### 2. Acceder a la aplicación
```
http://localhost:4200
```

---

## 📂 ESTRUCTURA DE ARCHIVOS CREADOS

```
farmacias-guardia/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── mapa-farmacias/
│   │   │       ├── mapa-farmacias.component.ts      ← Lógica principal
│   │   │       ├── mapa-farmacias.component.html    ← Template
│   │   │       └── mapa-farmacias.component.scss    ← Estilos
│   │   │
│   │   ├── models/
│   │   │   └── farmacia.model.ts                    ← Interfaces TypeScript
│   │   │
│   │   ├── services/
│   │   │   └── farmacias.service.ts                 ← Servicio de datos
│   │   │
│   │   ├── app.component.ts                         ← Componente raíz
│   │   └── app.module.ts                            ← Módulo principal
│   │
│   ├── assets/
│   │   └── i18n/
│   │       ├── es.json                              ← Traducciones español
│   │       └── eu.json                              ← Traducciones euskera
│   │
│   ├── index.html                                   ← HTML principal
│   └── styles.scss                                  ← Estilos globales
│
├── package.json                                     ← Dependencias
└── README.md                                        ← Documentación
```

---

## 🎨 FUNCIONALIDADES IMPLEMENTADAS

### ✅ Filtros disponibles

1. **Por Provincia**
   - Araba / Álava
   - Bizkaia / Vizcaya
   - Gipuzkoa / Guipúzcoa

2. **Por Municipio**
   - Se carga dinámicamente según la provincia seleccionada

3. **Por Tipo de Guardia**
   - 🌅 Guardia Diurna (8:00-22:00) - Color: Naranja
   - 🌙 Guardia Nocturna (22:00-8:00) - Color: Azul
   - ⏰ Guardia 24 horas - Color: Rojo
   - 📅 Días Laborables - Color: Verde
   - 🎉 Días Festivos - Color: Púrpura

### ✅ Características del mapa

- **Iconos diferenciados** según tipo de guardia
- **Tooltip** al pasar el ratón sobre una farmacia
- **Popup detallado** al hacer clic
- **Zoom automático** a los resultados filtrados
- **Vista inicial** centrada en Euskadi

### ✅ Información mostrada

Para cada farmacia se muestra:
- Nombre completo
- Dirección postal
- Código postal
- Municipio y provincia
- Teléfono (con enlace directo para llamar)
- Email (con enlace para enviar correo)
- Página web (si disponible)
- Tipos de guardia activos
- Información adicional del turno

### ✅ Interfaz bilingüe

- Español (ES)
- Euskera (EU)
- Cambio de idioma en tiempo real
- Todas las etiquetas traducidas

---

## 🔧 DETALLES TÉCNICOS

### Procesamiento de datos del GeoJSON

El servicio `FarmaciasService` procesa automáticamente el GeoJSON y detecta los tipos de guardia analizando el campo `turno` o `guardiaInfo`:

```typescript
// Ejemplos de detección:
- "diurna" o "día" → Guardia Diurna
- "nocturna" o "noche" → Guardia Nocturna
- "24" o "24h" → Guardia 24h
- "laborable" o "lunes" → Días Laborables
- "festivo" o "domingo" → Días Festivos
```

### Iconos SVG dinámicos

Los iconos se generan dinámicamente en formato SVG según el tipo de guardia:

```typescript
getIconoFarmacia(farmacia: Farmacia): string {
  // Genera SVG con el color correspondiente
  // Forma: Hexágono con cruz de farmacia
}
```

### Caché y optimización

- Los datos del GeoJSON se cargan una sola vez
- Los municipios se filtran dinámicamente según la provincia
- El mapa solo renderiza las farmacias visibles

---

## 🎯 CASOS DE USO

### Caso 1: Usuario busca farmacia de guardia nocturna en Donostia

1. Selecciona "Gipuzkoa" en Provincia
2. Selecciona "Donostia / San Sebastián" en Municipio
3. Marca checkbox "Guardia Nocturna"
4. El mapa muestra solo las farmacias con guardia nocturna en Donostia
5. Hace clic en un pin para ver información detallada

### Caso 2: Usuario busca farmacias 24h en todo Euskadi

1. No selecciona provincia ni municipio
2. Marca checkbox "Guardia 24 horas"
3. El mapa muestra todas las farmacias con servicio 24h
4. Puede hacer zoom para explorar diferentes zonas

### Caso 3: Usuario necesita farmacia de guardia en festivo

1. Selecciona su provincia
2. Marca checkbox "Días Festivos"
3. Ve las farmacias disponibles en festivos
4. Hace clic para obtener dirección y teléfono

---

## 🚧 POSIBLES MEJORAS FUTURAS

### 1. Geolocalización del usuario
```typescript
// Añadir botón "Cerca de mí"
// Ordenar resultados por distancia
// Mostrar ruta a la farmacia más cercana
```

### 2. Búsqueda por texto
```typescript
// Buscar por nombre de farmacia
// Buscar por dirección
// Autocompletado en tiempo real
```

### 3. Exportar resultados
```typescript
// Generar PDF con lista de farmacias
// Exportar a CSV
// Compartir vía WhatsApp/Email
```

### 4. Filtros adicionales
```typescript
// Por servicios (COVID test, tensión, etc.)
// Por accesibilidad (rampa, ascensor)
// Por parking disponible
```

### 5. Modo oscuro
```typescript
// Tema claro/oscuro
// Mapa con estilo personalizado nocturno
```

### 6. PWA (Progressive Web App)
```typescript
// Funcionar offline con datos en caché
// Instalable en móvil
// Notificaciones push para cambios de guardia
```

### 7. Favoritos
```typescript
// Guardar farmacias favoritas en localStorage
// Acceso rápido a farmacias habituales
```

### 8. Calendario de guardias
```typescript
// Mostrar calendario mensual
// Ver qué farmacias están de guardia cada día
// Exportar a Google Calendar
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "Cannot find module 'ol'"
```bash
npm install ol --save
```

### Error: CORS al cargar GeoJSON
- Problema del servidor de OpenData Euskadi
- Solución temporal: usar proxy CORS o configurar servidor local

### Los iconos no se muestran
- Verificar que la función `getIconoFarmacia()` esté correctamente implementada
- Comprobar que btoa() funciona en el navegador

### El mapa aparece vacío
- Verificar que `npm install` se ejecutó correctamente
- Comprobar la consola del navegador para errores
- Verificar conexión a internet para cargar tiles del mapa

### Las traducciones no cambian
- Verificar que los archivos JSON están en `src/assets/i18n/`
- Comprobar que TranslateModule está importado
- Hacer rebuild: `ng serve --force`

---

## 📊 DATOS Y FUENTES

### Fuente de datos oficial
```
URL: https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson

Formato: GeoJSON
Actualización: Periódica (verificar en OpenData Euskadi)
Licencia: Creative Commons (verificar condiciones específicas)
```

### Estructura del GeoJSON
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "properties": {
        "documentname": "Nombre farmacia",
        "address": "Dirección",
        "municipality": "Municipio",
        "territory": "Provincia",
        "postalcode": "CP",
        "phone": "Teléfono",
        "email": "Email",
        "turno": "Información de guardia"
      }
    }
  ]
}
```

---

## 📝 LICENCIAS Y CRÉDITOS

- **Datos**: OpenData Euskadi (Gobierno Vasco)
- **Mapa base**: OpenStreetMap
- **Framework**: Angular (MIT License)
- **Librería de mapas**: OpenLayers (BSD 2-Clause License)
- **Basado en**: angular-openlayer-bestfit

---

## 📞 SOPORTE

Para preguntas o problemas:
1. Revisar esta documentación
2. Comprobar la consola del navegador
3. Verificar que todas las dependencias están instaladas
4. Crear un issue en GitHub (si aplica)

---

**¡Gracias por usar Farmacias de Guardia - Euskadi!** 🏥💚
