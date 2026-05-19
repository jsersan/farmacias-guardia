// farmacias.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Farmacia, FarmaciasGeoJSON, TipoGuardia } from '../models/farmacia.model';

@Injectable({
  providedIn: 'root'
})
export class FarmaciasService {
  
  // SOLUCIÓN CON PROXY LOCAL: Descarga automática desde OpenData Euskadi
  // Ejecuta: npm run dev (inicia proxy + Angular)
  // O ejecuta en terminales separadas: npm run proxy + npm start
  private readonly GEOJSON_URL = 'http://localhost:3000/api/farmacias';
  
  // ALTERNATIVA: Usar datos locales (requiere descarga manual)
  // private readonly GEOJSON_URL = 'assets/data/farmaziak.geojson';
  
  // Los proxies CORS públicos suelen fallar:
  // private readonly GEOJSON_URL = 'https://api.allorigins.win/raw?url=' + 
  //   encodeURIComponent('https://opendata.euskadi.eus/contenidos/ds_localizaciones/farmacias_y_botiquines_euskadi/opendata/farmaziak.geojson');
  
  private farmaciasSubject = new BehaviorSubject<Farmacia[]>([]);
  public farmacias$ = this.farmaciasSubject.asObservable();
  
  private cargando = new BehaviorSubject<boolean>(false);
  public cargando$ = this.cargando.asObservable();

  constructor(private http: HttpClient) {}

  cargarFarmacias(): Observable<Farmacia[]> {
    this.cargando.next(true);
    
    return this.http.get<FarmaciasGeoJSON>(this.GEOJSON_URL).pipe(
      map(geojson => this.procesarGeoJSON(geojson)),
      tap(farmacias => {
        console.log(`✅ ${farmacias.length} farmacias cargadas`);
        this.farmaciasSubject.next(farmacias);
        this.cargando.next(false);
      }),
      catchError(error => {
        console.error('❌ Error cargando farmacias:', error);
        this.cargando.next(false);
        return of([]);
      })
    );
  }

  private procesarGeoJSON(geojson: FarmaciasGeoJSON): Farmacia[] {
    if (!geojson || !geojson.features) {
      console.warn('GeoJSON vacío o inválido');
      return [];
    }

    console.log(`📥 Procesando ${geojson.features.length} farmacias...`);

    return geojson.features.map((feature, index) => {
      // Extraer coordenadas desde geometry (formato GeoJSON estándar)
      const coordinates = feature.geometry?.coordinates || [0, 0];
      const [longitude, latitude] = coordinates;

      const props = feature.properties as any; // Permitir acceso flexible a propiedades

      // NORMALIZACIÓN: Primero declarar campos que usaremos en otros
      const municipality = props.municipality || props.municipio || 
                          props.localidad || '';
      
      const territory = props.territory || props.territorio || 
                       props.type || props.provincia || '';
      
      // Ahora podemos usar municipality en el fallback del nombre
      const documentName = props.documentName || props.documentname || 
                          props.nombre || props.name || props.laburpena ||
                          props.izena || props.izena_elkartea || 
                          `Farmacia ${municipality}`.trim() || 'Farmacia';
      
      const address = props.address || props.direccion || 
                     props.calle || '';
      
      const phone = props.phone || props.telefono || props.tel || '';
      
      const postalCode = props.postalCode || props.postalcode || 
                        props.codigoPostal || props.cp || '';

      // Procesar información de guardias
      const turno = props.turno || props.guardiaInfo || props.guardia || '';
      const turnoLower = turno.toLowerCase();

      // Mostrar progreso cada 100 farmacias
      if ((index + 1) % 100 === 0) {
        console.log(`   ⚙️ Procesadas ${index + 1}/${geojson.features.length} farmacias...`);
      }

      return {
        ...feature,
        properties: {
          ...feature.properties,
          // Campos normalizados
          documentName,
          territory,
          municipality,
          address,
          phone,
          postalCode,
          // Coordenadas
          longitude,
          latitude,
          // Detectar tipos de guardia
          guardiaDiurna: this.esGuardiaDiurna(turnoLower),
          guardiaNocturna: this.esGuardiaNocturna(turnoLower),
          guardia24h: this.esGuardia24h(turnoLower),
          guardiaLaborables: this.esGuardiaLaborables(turnoLower),
          guardiaFestivos: this.esGuardiaFestivos(turnoLower)
        }
      };
    });
  }

  private esGuardiaDiurna(turno: string): boolean {
    return turno.includes('diurna') || 
           turno.includes('día') || 
           turno.includes('eguneko') ||
           (turno.includes('8') && turno.includes('22'));
  }

  private esGuardiaNocturna(turno: string): boolean {
    return turno.includes('nocturna') || 
           turno.includes('noche') || 
           turno.includes('gaueko') ||
           (turno.includes('22') && turno.includes('8'));
  }

  private esGuardia24h(turno: string): boolean {
    return turno.includes('24') || 
           turno.includes('24h') || 
           turno.includes('24 h') ||
           turno.includes('continua') ||
           turno.includes('etengabea');
  }

  private esGuardiaLaborables(turno: string): boolean {
    return turno.includes('laborable') || 
           turno.includes('laboral') || 
           turno.includes('lan') ||
           turno.includes('lunes') ||
           turno.includes('astelehen');
  }

  private esGuardiaFestivos(turno: string): boolean {
    return turno.includes('festivo') || 
           turno.includes('domingo') || 
           turno.includes('jaiegun') ||
           turno.includes('igande');
  }

  getProvincias(): string[] {
    const farmacias = this.farmaciasSubject.value;
    return Array.from(new Set(farmacias.map(f => f.properties.territory || '')))
      .filter(t => t && t.trim() !== '')
      .sort();
  }

  getMunicipios(provincia?: string): string[] {
    const farmacias = this.farmaciasSubject.value;
    let filtradas = farmacias;

    if (provincia) {
      filtradas = farmacias.filter(f => f.properties.territory === provincia);
    }

    return Array.from(new Set(filtradas.map(f => f.properties.municipality || '')))
      .filter(m => m && m.trim() !== '')
      .sort();
  }

  filtrarFarmacias(
    provincia?: string,
    municipio?: string,
    tiposGuardia?: TipoGuardia[]
  ): Farmacia[] {
    let farmacias = this.farmaciasSubject.value;

    if (provincia) {
      farmacias = farmacias.filter(f => f.properties.territory === provincia);
    }

    if (municipio) {
      farmacias = farmacias.filter(f => f.properties.municipality === municipio);
    }

    if (tiposGuardia && tiposGuardia.length > 0) {
      farmacias = farmacias.filter(f => {
        return tiposGuardia.some(tipo => {
          switch(tipo) {
            case TipoGuardia.DIURNA:
              return f.properties.guardiaDiurna;
            case TipoGuardia.NOCTURNA:
              return f.properties.guardiaNocturna;
            case TipoGuardia.VEINTICUATRO:
              return f.properties.guardia24h;
            case TipoGuardia.LABORABLES:
              return f.properties.guardiaLaborables;
            case TipoGuardia.FESTIVOS:
              return f.properties.guardiaFestivos;
            default:
              return false;
          }
        });
      });
    }

    return farmacias;
  }

  getTiposGuardiaDisponibles(farmacias: Farmacia[]): Set<TipoGuardia> {
    const tipos = new Set<TipoGuardia>();

    farmacias.forEach(f => {
      if (f.properties.guardiaDiurna) tipos.add(TipoGuardia.DIURNA);
      if (f.properties.guardiaNocturna) tipos.add(TipoGuardia.NOCTURNA);
      if (f.properties.guardia24h) tipos.add(TipoGuardia.VEINTICUATRO);
      if (f.properties.guardiaLaborables) tipos.add(TipoGuardia.LABORABLES);
      if (f.properties.guardiaFestivos) tipos.add(TipoGuardia.FESTIVOS);
    });

    return tipos;
  }
}
