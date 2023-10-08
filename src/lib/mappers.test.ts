import { describe, it, expect, beforeEach } from 'vitest';
import type { ApiStation, ApiStationStatus } from './types';
import { mapStationData } from './mappers';

const createApiStations = (): ApiStation[] => [
	{
		station_id: '2350',
		name: 'Blindern T-Bane',
		lat: 59.94025210701875,
		lon: 10.716723884520064,
		is_virtual_station: false
	},
	{
		station_id: '2349',
		name: 'Maritimt Museum',
		lat: 59.902942924651484,
		lon: 10.698048967006343,
		is_virtual_station: false
	},
	{
		station_id: '2347',
		name: 'Huk 2',
		lat: 59.89843428245928,
		lon: 10.674398461025874,
		is_virtual_station: false
	},
	{
		station_id: '2340',
		name: 'Tiedemannsparken',
		lat: 59.92024767905539,
		lon: 10.793540704010042,
		is_virtual_station: false
	}
];

const createApiStationStatuses = (): ApiStationStatus[] => [
	{
		is_installed: true,
		is_renting: false,
		is_returning: true,
		num_bikes_available: 0,
		num_docks_available: 24
	},
	{
		is_installed: true,
		is_renting: true,
		is_returning: true,
		num_bikes_available: 3,
		num_docks_available: 13
	},
	{
		is_installed: true,
		is_renting: true,
		is_returning: true,
		num_bikes_available: 16,
		num_docks_available: 0
	},
	{
		is_installed: true,
		is_renting: true,
		is_returning: false,
		num_bikes_available: 10,
		num_docks_available: 5
	}
];

declare module 'vitest' {
	export interface TestContext {
		apiStations: ApiStation[];
		apiStationStatuses: ApiStationStatus[];
	}
}

describe('mappers', () => {
	describe('mapStationData', () => {
		beforeEach(async (context) => {
			context.apiStations = createApiStations();
			context.apiStationStatuses = createApiStationStatuses();
		});

		it('returns a list of four stations when all stations are non-virtual and installed', ({
			apiStations,
			apiStationStatuses
		}) => {
			const stations = mapStationData(apiStations, apiStationStatuses);
			expect(stations.length).toBe(4);
		});

		it('returns a list containing data for Bilndern T-Bane in the first element', ({
			apiStations,
			apiStationStatuses
		}) => {
			const stations = mapStationData(apiStations, apiStationStatuses);
			const [first] = stations;

			expect(first.id).toEqual('2350');
			expect(first.name).toEqual('Blindern T-Bane');
			expect(first.lat).toEqual(59.94025210701875);
			expect(first.lon).toEqual(10.716723884520064);
			expect(first.isRenting).toBe(false);
			expect(first.isReturning).toBe(true);
			expect(first.numBikesAvailable).toEqual(0);
			expect(first.numDocksAvailable).toEqual(24);
			expect(first.isAvailable).toBe(true);
		});

		it('returns a list containing data for Tiedemannsparken in the last element', ({
			apiStations,
			apiStationStatuses
		}) => {
			const stations = mapStationData(apiStations, apiStationStatuses);
			const [_first, _second, _third, fourth] = stations;

			expect(stations.length).toEqual(4);
			expect(fourth.id).toEqual('2340');
			expect(fourth.name).toEqual('Tiedemannsparken');
			expect(fourth.lat).toEqual(59.92024767905539);
			expect(fourth.lon).toEqual(10.793540704010042);
			expect(fourth.isRenting).toBe(true);
			expect(fourth.isReturning).toBe(false);
			expect(fourth.numBikesAvailable).toEqual(10);
			expect(fourth.numDocksAvailable).toEqual(5);
			expect(fourth.isAvailable).toBe(true);
		});

		it('only returns available stations', ({ apiStations, apiStationStatuses }) => {
			const stations = mapStationData(apiStations, apiStationStatuses);
			expect(stations.filter((s) => s.isAvailable).length).toEqual(stations.length);
		});

		it('only returns stations that are non-virtual', ({ apiStations, apiStationStatuses }) => {
			apiStations[1].is_virtual_station = true;
			apiStations[3].is_virtual_station = true;
			const stations = mapStationData(apiStations, apiStationStatuses);
			expect(stations.map((s) => s.id)).toEqual(['2350', '2347']);
		});

		it('only returns stations that are installed', ({ apiStations, apiStationStatuses }) => {
			apiStationStatuses[0].is_installed = false;
			apiStationStatuses[2].is_installed = false;
			const stations = mapStationData(apiStations, apiStationStatuses);
			expect(stations.map((s) => s.id)).toEqual(['2349', '2340']);
		});
	});
});
