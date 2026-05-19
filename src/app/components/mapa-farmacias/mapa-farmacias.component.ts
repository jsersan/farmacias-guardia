// mapa-farmacias.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { fromLonLat, transformExtent } from 'ol/proj';

import { FarmaciasService } from '../../services/farmacias.service';
import { Farmacia, TipoGuardia } from '../../models/farmacia.model';

interface TipoGuardiaOption {
  value: TipoGuardia;
  label: string;
  labelEU: string;
  color: string;
}

@Component({
  selector: 'app-mapa-farmacias',
  templateUrl: './mapa-farmacias.component.html',
  styleUrls: ['./mapa-farmacias.component.scss']
})
export class MapaFarmaciasComponent implements OnInit, AfterViewInit {
  
  // ── Propiedades del mapa ────────────────────────────────────────────
  map!: Map;
  pinsLayer!: VectorLayer<any>;
  
  // ── Datos ───────────────────────────────────────────────────────────
  todasFarmacias: Farmacia[] = [];
  farmaciasMostradas: Farmacia[] = [];
  
  // ── Filtros ─────────────────────────────────────────────────────────
  provincias: string[] = [];
  municipios: string[] = [];
  municipioEnabled = false;
  
  provinciaSeleccionada = '';
  municipioSeleccionado = '';
  tiposGuardiaSeleccionados: TipoGuardia[] = [];
  
  // ── Tipos de guardia disponibles ────────────────────────────────────
  tiposGuardia: TipoGuardiaOption[] = [
    { 
      value: TipoGuardia.DIURNA, 
      label: 'Guardia Diurna (8:00-22:00)', 
      labelEU: 'Eguneko Zaintza (8:00-22:00)',
      color: '#FFA500'
    },
    { 
      value: TipoGuardia.NOCTURNA, 
      label: 'Guardia Nocturna (22:00-8:00)', 
      labelEU: 'Gaueko Zaintza (22:00-8:00)',
      color: '#4169E1'
    },
    { 
      value: TipoGuardia.VEINTICUATRO, 
      label: 'Guardia 24 horas', 
      labelEU: '24 orduko Zaintza',
      color: '#DC143C'
    },
    { 
      value: TipoGuardia.LABORABLES, 
      label: 'Días Laborables', 
      labelEU: 'Lanegunak',
      color: '#32CD32'
    },
    { 
      value: TipoGuardia.FESTIVOS, 
      label: 'Días Festivos', 
      labelEU: 'Jaiegun eta Iganderak',
      color: '#9370DB'
    }
  ];
  
  // ── UI ──────────────────────────────────────────────────────────────
  currentLang: 'es' | 'eu' = 'es';
  cargando = false;
  popupVisible = false;
  farmaciaSeleccionada: Farmacia | null = null;
  popupPosition = { x: 0, y: 0 };
  
  tooltipVisible = false;
  tooltipContent = '';
  tooltipX = 0;
  tooltipY = 0;
  
  // ── Configuración mapa ──────────────────────────────────────────────
  euskadiExtent = transformExtent(
    [-3.4, 42.57, -1.5, 43.45],
    'EPSG:4326',
    'EPSG:3857'
  );

  constructor(
    private farmaciasService: FarmaciasService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');
    const browserLang = this.translate.getBrowserLang();
    this.currentLang = browserLang?.match(/es|eu/) ? (browserLang as 'es' | 'eu') : 'es';
    this.translate.use(this.currentLang);
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  // ── Carga de datos ──────────────────────────────────────────────────
  cargarDatos(): void {
    this.cargando = true;
    
    this.farmaciasService.cargarFarmacias().subscribe({
      next: (farmacias) => {
        this.todasFarmacias = farmacias;
        this.farmaciasMostradas = farmacias;
        this.provincias = this.farmaciasService.getProvincias();
        this.cargando = false;
        
        if (this.map) {
          this.mostrarFarmaciasEnMapa(farmacias);
        }
        
        this.snackBar.open(
          `${farmacias.length} farmacias cargadas correctamente`,
          'OK',
          { duration: 3000, panelClass: ['snackbar-info'] }
        );
      },
      error: (error) => {
        this.cargando = false;
        this.snackBar.open(
          'Error al cargar las farmacias. Por favor, intenta de nuevo.',
          'OK',
          { duration: 5000, panelClass: ['snackbar-error'] }
        );
        console.error('Error:', error);
      }
    });
  }

  // ── Inicialización del mapa ─────────────────────────────────────────
  inicializarMapa(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({ source: new OSM() })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    this.map.getView().fit(this.euskadiExtent, {
      duration: 100,
      padding: [30, 30, 30, 30],
      maxZoom: 9
    });

    // Eventos del mapa
    this.map.on('singleclick', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, (f) => f as any);
      if (feature) {
        const props = feature.getProperties();
        this.onSelectFarmacia(props.farmacia, evt.pixel);
      } else {
        this.cerrarPopup();
      }
    });

    this.map.on('pointermove', (evt) => {
      const pixel = this.map.getEventPixel(evt.originalEvent);
      const feature = this.map.forEachFeatureAtPixel(pixel, (f) => f as any);

      if (feature) {
        const props = feature.getProperties();
        const farmacia = props.farmacia as Farmacia;
        
        if (this.popupVisible && this.farmaciaSeleccionada === farmacia) {
          this.tooltipVisible = false;
          return;
        }

        this.tooltipVisible = true;
        this.tooltipContent = `
          <strong>${farmacia.properties.documentName || 'Farmacia'}</strong><br>
          ${farmacia.properties.municipality || ''}
        `;

        const mouseEvt = evt.originalEvent as MouseEvent;
        this.tooltipX = mouseEvt.clientX + 12;
        this.tooltipY = mouseEvt.clientY - 14;

        (this.map.getTargetElement() as HTMLElement).style.cursor = 'pointer';
      } else {
        this.tooltipVisible = false;
        (this.map.getTargetElement() as HTMLElement).style.cursor = '';
      }
    });

    this.pinsLayer = new VectorLayer({
      source: new VectorSource({ features: [] })
    });

    this.map.addLayer(this.pinsLayer);

    if (this.todasFarmacias.length > 0) {
      this.mostrarFarmaciasEnMapa(this.todasFarmacias);
    }
  }

  // ── Mostrar farmacias en el mapa ────────────────────────────────────
  mostrarFarmaciasEnMapa(farmacias: Farmacia[]): void {
    const features: Feature<Point>[] = [];

    farmacias.forEach(farmacia => {
      const coords = fromLonLat([
        farmacia.properties.longitude,
        farmacia.properties.latitude
      ]);

      const point = new Point(coords);
      const feature = new Feature<Point>({ geometry: point });

      // Icono según tipo de guardia
      const iconoUrl = this.getIconoFarmacia(farmacia);

      feature.setStyle(
        new Style({
          image: new Icon({
            src: iconoUrl,
            scale: 0.6,
            anchor: [0.5, 1]
          })
        })
      );

      feature.setProperties({ farmacia });
      features.push(feature);
    });

    if (this.pinsLayer) this.map.removeLayer(this.pinsLayer);

    this.pinsLayer = new VectorLayer({
      source: new VectorSource({ features })
    });

    this.map.addLayer(this.pinsLayer);

    // Ajustar vista
    if (features.length > 0) {
      const vectorSource = this.pinsLayer.getSource();
      if (vectorSource) {
        const extent = vectorSource.getExtent();
        this.map.getView().fit(extent, {
          duration: 600,
          padding: [60, 60, 60, 60],
          maxZoom: 14
        });
      }
    }
  }

  // ── Obtener icono según tipo de guardia ────────────────────────────
  getIconoFarmacia(farmacia: Farmacia): string {
    if (farmacia.properties.guardia24h) {
      return 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
          <path d="M20 0 L40 15 L40 35 L20 50 L0 35 L0 15 Z" fill="#DC143C" stroke="#fff" stroke-width="2"/>
          <text x="20" y="30" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle">+</text>
        </svg>
      `);
    } else if (farmacia.properties.guardiaNocturna) {
      return 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
          <path d="M20 0 L40 15 L40 35 L20 50 L0 35 L0 15 Z" fill="#4169E1" stroke="#fff" stroke-width="2"/>
          <text x="20" y="30" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle">+</text>
        </svg>
      `);
    } else if (farmacia.properties.guardiaDiurna) {
      return 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
          <path d="M20 0 L40 15 L40 35 L20 50 L0 35 L0 15 Z" fill="#FFA500" stroke="#fff" stroke-width="2"/>
          <text x="20" y="30" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle">+</text>
        </svg>
      `);
    } else {
      return 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
          <path d="M20 0 L40 15 L40 35 L20 50 L0 35 L0 15 Z" fill="#32CD32" stroke="#fff" stroke-width="2"/>
          <text x="20" y="30" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle">+</text>
        </svg>
      `);
    }
  }

  // ── Filtros ─────────────────────────────────────────────────────────
  onChangeProvincia(): void {
    if (this.provinciaSeleccionada) {
      this.municipios = this.farmaciasService.getMunicipios(this.provinciaSeleccionada);
      this.municipioEnabled = true;
    } else {
      this.municipios = [];
      this.municipioSeleccionado = '';
      this.municipioEnabled = false;
    }
    this.aplicarFiltros();
  }

  onChangeMunicipio(): void {
    this.aplicarFiltros();
  }

  onChangeTipoGuardia(): void {
    this.aplicarFiltros();
  }

  onCheckTipoGuardia(tipo: TipoGuardia, event: any): void {
    if (event.target.checked) {
      if (!this.tiposGuardiaSeleccionados.includes(tipo)) {
        this.tiposGuardiaSeleccionados.push(tipo);
      }
    } else {
      const index = this.tiposGuardiaSeleccionados.indexOf(tipo);
      if (index > -1) {
        this.tiposGuardiaSeleccionados.splice(index, 1);
      }
    }
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    // Cerrar popup si está abierto
    this.cerrarPopup();
    
    this.farmaciasMostradas = this.farmaciasService.filtrarFarmacias(
      this.provinciaSeleccionada || undefined,
      this.municipioSeleccionado || undefined,
      this.tiposGuardiaSeleccionados.length > 0 ? this.tiposGuardiaSeleccionados : undefined
    );

    if (this.farmaciasMostradas.length === 0) {
      this.snackBar.open(
        'No se encontraron farmacias con los filtros seleccionados',
        'OK',
        { duration: 3000, panelClass: ['snackbar-error'] }
      );
    }

    this.mostrarFarmaciasEnMapa(this.farmaciasMostradas);
  }

  limpiarFiltros(): void {
    this.provinciaSeleccionada = '';
    this.municipioSeleccionado = '';
    this.tiposGuardiaSeleccionados = [];
    this.municipios = [];
    this.municipioEnabled = false;
    
    this.farmaciasMostradas = this.todasFarmacias;
    this.mostrarFarmaciasEnMapa(this.todasFarmacias);
    this.cerrarPopup();
    
    this.map.getView().fit(this.euskadiExtent, {
      duration: 400,
      padding: [30, 30, 30, 30],
      maxZoom: 9
    });
  }

  // ── Popup ───────────────────────────────────────────────────────────
  onSelectFarmacia(farmacia: Farmacia, pixel: number[]): void {
    this.farmaciaSeleccionada = farmacia;
    this.tooltipVisible = false;
    
    const [x, y] = pixel;
    this.popupPosition = { x, y };
    this.popupVisible = true;
  }

  cerrarPopup(): void {
    this.popupVisible = false;
    this.farmaciaSeleccionada = null;
  }

  getTiposGuardiaFarmacia(farmacia: Farmacia): string[] {
    const tipos: string[] = [];
    
    if (farmacia.properties.guardia24h) tipos.push('24h');
    if (farmacia.properties.guardiaDiurna) tipos.push(this.currentLang === 'eu' ? 'Egunekoa' : 'Diurna');
    if (farmacia.properties.guardiaNocturna) tipos.push(this.currentLang === 'eu' ? 'Gauekoa' : 'Nocturna');
    if (farmacia.properties.guardiaLaborables) tipos.push(this.currentLang === 'eu' ? 'Lanegunak' : 'Laborables');
    if (farmacia.properties.guardiaFestivos) tipos.push(this.currentLang === 'eu' ? 'Jaiegunak' : 'Festivos');
    
    return tipos;
  }

  getUrlConsultaGuardia(provincia: string | undefined): string {
    // URLs oficiales de los Colegios de Farmacéuticos para consultar guardias reales
    const urls: Record<string, string> = {
      'Gipuzkoa': 'https://www.cofgipuzkoa.eus/ciudadano/farmacias-gipuzkoa/farmacias-de-guardia-2/',
      'GIPUZKOA': 'https://www.cofgipuzkoa.eus/ciudadano/farmacias-gipuzkoa/farmacias-de-guardia-2/',
      'Bizkaia': 'https://www.cofbizkaia.eus/farmacia_de_guardia/',
      'BIZKAIA': 'https://www.cofbizkaia.eus/farmacia_de_guardia/',
      'Araba / Álava': 'https://cofalava.org/farmacias-de-guardia/',
      'Araba': 'https://cofalava.org/farmacias-de-guardia/',
      'ARABA': 'https://cofalava.org/farmacias-de-guardia/',
      'Álava': 'https://cofalava.org/farmacias-de-guardia/',
      'ALAVA': 'https://cofalava.org/farmacias-de-guardia/'
    };
    
    // Si no hay provincia, usar Gipuzkoa por defecto
    if (!provincia) {
      return 'https://www.cofgipuzkoa.eus/ciudadano/farmacias-gipuzkoa/farmacias-de-guardia-2/';
    }
    
    // Buscar por provincia (con y sin normalizar)
    const url = urls[provincia] || urls[provincia.toUpperCase()] || urls[provincia.toLowerCase()];
    
    // Por defecto, Gipuzkoa
    return url || 'https://www.cofgipuzkoa.eus/ciudadano/farmacias-gipuzkoa/farmacias-de-guardia-2/';
  }

  // Convertir texto a formato título (primera letra mayúscula)
  toTitleCase(text: string): string {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .split(/[\s/-]+/) // Dividir por espacios, guiones y barras
      .map(word => {
        // Excepciones que deben mantenerse en minúsculas
        const lowercase = ['de', 'y', 'el', 'la', 'los', 'las', 'del'];
        if (lowercase.includes(word)) {
          return word;
        }
        // Primera letra mayúscula, resto minúscula
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ')
      .replace(/\s+\//g, '/') // Quitar espacios antes de /
      .replace(/\/\s+/g, '/'); // Quitar espacios después de /
  }

  // ── Idioma ──────────────────────────────────────────────────────────
  cambiarIdioma(lang: 'es' | 'eu'): void {
    this.currentLang = lang;
    this.translate.use(lang);
  }

  getTipoGuardiaLabel(tipo: TipoGuardiaOption): string {
    return this.currentLang === 'eu' ? tipo.labelEU : tipo.label;
  }

  // ── Utilidades ──────────────────────────────────────────────────────
  irAInicio(): void {
    this.limpiarFiltros();
  }
}
