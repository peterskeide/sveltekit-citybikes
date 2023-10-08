// Internal station data structure
export interface Station {
	id: string;
	name: string;
	lat: number;
	lon: number;
	numBikesAvailable: number;
	numDocksAvailable: number;
	isAvailable: boolean;
	isRenting: boolean;
	isReturning: boolean;
}

// Station data returned from the API
export interface ApiStation {
	station_id: string;
	name: string;
	lat: number;
	lon: number;
	is_virtual_station: boolean;
}

// Station status data returned from the API
export interface ApiStationStatus {
	num_bikes_available: number;
	num_docks_available: number;
	is_installed: boolean;
	is_returning: boolean;
	is_renting: boolean;
}

export type DisplayMode = 'bikes' | 'docks';
