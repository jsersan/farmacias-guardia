// farmacias.service.ts - CON FALLBACK A DATOS LOCALES
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Farmacia, FarmaciasGeoJSON, TipoGuardia } from '../models/farmacia.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FarmaciasService {
  
  private readonly GEOJSON_URL = environment.apiUrl;
  // ⬇️ FALLBACK: Si el servidor falla, usar datos locales
  private readonly LOCAL_FALLBACK = 'assets/data/farmaziak.geojson';
  
  private farmaciasSubject = new BehaviorSubject<Farmacia[]>([]);
  public farmacias$ = this.farmaciasSubject.asObservable();
  
  private cargando = new BehaviorSubject<boolean>(false);
  public cargando$ = this.cargando.asObservable();

  constructor(private http: HttpClient) {}

  cargarFarmacias(): Observable<Farmacia[]> {
    this.cargando.next(true);
    
    console.log('🔍 Cargando desde:', this.GEOJSON_URL);
    
    return this.http.get<FarmaciasGeoJSON>(this.GEOJSON_URL).pipe(
      map(geojson => this.procesarGeoJSON(geojson)),
      tap(farmacias => {
        console.log(`✅ ${farmacias.length} farmacias cargadas desde servidor`);
        this.farmaciasSubject.next(farmacias);
        this.cargando.next(false);
      }),
      catchError(error => {
        console.error('❌ Error cargando desde servidor:', error.message);
        console.warn('🔄 Intentando cargar desde archivo local...');
        
        // Fallback: intentar cargar desde archivo local
        return this.http.get<FarmaciasGeoJSON>(this.LOCAL_FALLBACK).pipe(
          map(geojson => this.procesarGeoJSON(geojson)),
          tap(farmacias => {
            console.log(`✅ ${farmacias.length} farmacias cargadas desde archivo local`);
            this.farmaciasSubject.next(farmacias);
            this.cargando.next(false);
          }),
          catchError(localError => {
            console.error('❌ Error cargando desde archivo local:', localError.message);
            this.cargando.next(false);
            return of([]);
          })
        );
      })
    );
  }

  private procesarGeoJSON(geojson: FarmaciasGeoJSON): Farmacia[] {
    if (!geojson || !geojson.features) {
      console.warn('GeoJSON vacío o inválido');
      return [];
    }

    console.log(`📥 Procesando ${geojson.features.length} farmacias...`);

    // 🔍 DEBUG: Mostrar campos de la primera farmacia
    if (geojson.features.length > 0) {
      console.log('🔍 DEBUG - Campos disponibles en primera farmacia:');
      console.log(geojson.features[0].properties);
    }

    return geojson.features.map((feature, index) => {
      const coordinates = feature.geometry?.coordinates || [0, 0];
      const [longitude, latitude] = coordinates;

      const props = feature.properties as any;

      const municipality = props.municipality || props.municipio || 
                          props.localidad || '';
      
      const territory = props.territory || props.territorio || 
                       props.type || props.provincia || '';
      
      const documentName = 
        props.documentName || 
        props.documentname || 
        props.nombre || 
        props.name || 
        props.laburpena ||
        props.izena ||
        props.izena_elkartea ||
        props.titular ||
        props.propietario ||
        props.razonSocial ||
        props.denominacion ||
        props.title ||
        props.label ||
        props.farmacia ||
        `Farmacia ${municipality}`.trim() || 
        'Farmacia';
      
      const address = props.address || props.direccion || 
                     props.calle || props.helbidea || '';
      
      const phone = props.phone || props.telefono || props.tel || 
                   props.telefonoa || '';
      
      const postalCode = props.postalCode || props.postalcode || 
                        props.codigoPostal || props.cp || 
                        props.posta_kodea || '';

      const turno = props.turno || props.guardiaInfo || props.guardia || '';
      const turnoLower = turno.toLowerCase();

      if ((index + 1) % 100 === 0) {
        console.log(`   ⚙️ Procesadas ${index + 1}/${geojson.features.length} farmacias...`);
      }

      if (documentName.startsWith('Farmacia ') && index < 5) {
        console.warn(`⚠️ Farmacia ${index + 1} usa nombre genérico:`, documentName);
        console.warn('   Campos disponibles:', Object.keys(props));
      }

      return {
        ...feature,
        properties: {
          ...feature.properties,
          documentName,
          territory,
          municipality,
          address,
          phone,
          postalCode,
          longitude,
          latitude,
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