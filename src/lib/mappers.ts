import type { ApiStation, ApiStationStatus, Station } from './types';

export const mapStationData = (
	apiStations: ApiStation[],
	apiStationStatuses: ApiStationStatus[]
): Station[] =>
	apiStations
		.map((station: ApiStation, index: number) => {
			const status: ApiStationStatus = apiStationStatuses[index];

			return {
				id: station.station_id,
				name: station.name,
				lat: station.lat,
				lon: station.lon,
				numBikesAvailable: status.num_bikes_available,
				numDocksAvailable: status.num_docks_available,
				isAvailable: !station.is_virtual_station && status.is_installed,
				isReturning: status.is_returning,
				isRenting: status.is_renting
			};
		})
		.filter((station: Station) => station.isAvailable);
