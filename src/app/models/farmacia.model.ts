// farmacia.model.ts

export interface Farmacia {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    documentid?: string;
    documentname?: string;        // Original minúscula
    documentName?: string;        // Normalizado camelCase
    documentdescription?: string;
    turno?: string;
    address?: string;             // Normalizado
    direccion?: string;           // Original español
    municipality?: string;        // Normalizado
    municipio?: string;           // Original español
    territory?: string;           // Normalizado
    territorio?: string;          // Original español
    type?: string;                // Alternativo
    provincia?: string;           // Alternativo
    postalcode?: string;          // Original minúscula
    postalCode?: string;          // Normalizado camelCase
    phone?: string;               // Normalizado
    telefono?: string;            // Original español
    email?: string;
    web?: string;
    latitude: number;
    longitude: number;
    guardiaDiurna?: boolean;
    guardiaNocturna?: boolean;
    guardia24h?: boolean;
    guardiaLaborables?: boolean;
    guardiaFestivos?: boolean;
    guardiaInfo?: string;
    [key: string]: any;           // Permitir propiedades dinámicas
  };
}

export interface FarmaciasGeoJSON {
  type: 'FeatureCollection';
  features: Farmacia[];
}

export enum TipoGuardia {
  DIURNA = 'diurna',
  NOCTURNA = 'nocturna',
  VEINTICUATRO = '24h',
  LABORABLES = 'laborables',
  FESTIVOS = 'festivos'
}

export interface FiltrosFarmacias {
  provincia?: string;
  municipio?: string;
  tipoGuardia?: TipoGuardia[];
  busqueda?: string;
}
