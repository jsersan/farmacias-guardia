# 🏥 Farmacias de Guardia - Euskadi

Aplicación web desarrollada con Angular 15 y OpenLayers para buscar y visualizar en un mapa las farmacias de guardia en la Comunidad Autónoma Vasca (Euskadi).

![Farmacias de Guardia](screenshot.png)

## 📋 Características

- **Mapa interactivo** con todas las farmacias de Euskadi
- **Filtros avanzados**:
  - Por provincia (Araba, Bizkaia, Gipuzkoa)
  - Por municipio
  - Por tipo de guardia:
    - 🌅 Guardia Diurna (8:00-22:00)
    - 🌙 Guardia Nocturna (22:00-8:00)
    - ⏰ Guardia 24 horas
    - 📅 Días Laborables
    - 🎉 Días Festivos
- **Información detallada** de cada farmacia:
  - Dirección completa
  - Teléfono y email
  - Web
  - Tipos de guardia disponibles
- **Interfaz bilingüe**: Español / Euskera
- **Diseño responsive**: Funciona en móviles, tablets y escritorio
- **Datos en tiempo real** desde OpenData Euskadi

## 🚀 Instalación

### Requisitos previos

- Node.js (v16 o superior)
- npm (v8 o superior)
- Angular CLI (`npm install -g @angular/cli`)

### Pasos de instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/tu-usuario/farmacias-guardia-euskadi.git
cd farmacias-guardia-euskadi
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Iniciar servidor de desarrollo**:
```bash
npm start
# o
ng serve
```

4. **Abrir en el navegador**:
```
http://localhost:4200
```

## 🏗️ Estructura del proyecto

```
farmacias-guardia/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── mapa-farmacias/
│   │   │       ├── mapa-farmacias.component.ts
│   │   │       ├── mapa-farmacias.component.html
│   │   │       └── mapa-farmacias.component.scss
│   │   ├── models/
│   │   │   └── farmacia.model.ts
│   │   ├── services/
│   │   │   └── farmacias.service.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── assets/
│   │   └── i18n/
│   │       ├── es.json  # Traducciones español
│   │       └── eu.json  # Traducciones euskera
│   ├── index.html
│   └── styles.scss
├── package.json
└── README.md
```

## 🔧 Tecnologías utilizadas

- **Frontend**: Angular 15
- **Mapa**: OpenLayers 10
- **Estilos**: SCSS, Angular Material
- **Traducciones**: ngx-translate
- **HTTP Client**: Angular HttpClient
- **Datos**: GeoJSON desde OpenData Euskadi

## 📊 Fuente de datos

Los datos se obtienen en tiempo real desde:
```
https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson
```

Este dataset contiene información actualizada de todas las farmacias de Euskadi, incluyendo:
- Coordenadas geográficas
- Información de contacto
- Horarios de guardia
- Tipo de servicio

## 🎨 Personalización

### Colores de iconos según tipo de guardia

Puedes modificar los colores en `mapa-farmacias.component.ts`:

```typescript
tiposGuardia: TipoGuardiaOption[] = [
  { value: TipoGuardia.DIURNA, color: '#FFA500' },     // Naranja
  { value: TipoGuardia.NOCTURNA, color: '#4169E1' },   // Azul
  { value: TipoGuardia.VEINTICUATRO, color: '#DC143C' }, // Rojo
  { value: TipoGuardia.LABORABLES, color: '#32CD32' }, // Verde
  { value: TipoGuardia.FESTIVOS, color: '#9370DB' }    // Púrpura
];
```

### Estilos

Los estilos principales están en:
- `src/app/components/mapa-farmacias/mapa-farmacias.component.scss`
- Variables globales al inicio del archivo

## 📱 Características responsive

La aplicación se adapta automáticamente a diferentes tamaños de pantalla:

- **Desktop**: Sidebar lateral con filtros
- **Tablet**: Diseño optimizado
- **Mobile**: Filtros superiores colapsables

## 🌐 Traducciones

La aplicación soporta español y euskera. Las traducciones están en:
- `src/assets/i18n/es.json`
- `src/assets/i18n/eu.json`

Para añadir más idiomas, crea nuevos archivos JSON en la misma carpeta.

## 🚀 Build de producción

Para generar una versión optimizada para producción:

```bash
npm run build
```

Los archivos se generarán en `dist/farmacias-guardia-euskadi/`

## 🐛 Solución de problemas

### Error de CORS
Si encuentras problemas de CORS al cargar los datos, asegúrate de que tu servidor permite solicitudes desde `localhost:4200`.

### Mapa no se muestra
Verifica que OpenLayers esté correctamente instalado:
```bash
npm install ol --save
```

### Traducciones no funcionan
Verifica que los archivos JSON estén en `src/assets/i18n/` y que el módulo TranslateModule esté importado en `app.module.ts`.

## 📝 Licencia

MIT License - Puedes usar este código libremente en tus proyectos.

## 👨‍💻 Autor

Desarrollado a partir del proyecto base de [angular-openlayer-bestfit](https://github.com/jsersan/angular-openlayer-bestfit)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

Si tienes preguntas o sugerencias, abre un issue en GitHub.

---

**¡Gracias por usar Farmacias de Guardia - Euskadi!** 🏥💚
# farmacias-guardia
