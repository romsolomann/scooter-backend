export type Geolocation = {
  latitude: number;
  longitude: number;
};

export type Address = {
  location: Geolocation;
  street: { name: string; number?: number };
  city: string;
};

export interface Point {
  latitude: number;
  longitude: number;
}

export type Polygon = Point[];
