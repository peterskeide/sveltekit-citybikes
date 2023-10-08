import type { PageServerLoad } from './$types';
import { API_HOST } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { Station } from '$lib/types';
import { mapStationData } from '$lib/mappers';

const genericErrorMessage = 'Error fetching data from the API';

export const load: PageServerLoad = async (): Promise<{ stations: Station[] }> => {
	try {
		const headers = {
			'Client-Identifier': 'sveltekit-demoapp'
		};

		const [stationsResponse, statusResponse] = await Promise.all([
			fetch(`${API_HOST}/oslobysykkel.no/station_information.json`, { headers }),
			fetch(`${API_HOST}/oslobysykkel.no/station_status.json`, { headers })
		]);

		if (!stationsResponse.ok) {
			console.error('Error fetching stations from the API: %s', stationsResponse.status);
			throw error(500, genericErrorMessage);
		}

		if (!statusResponse.ok) {
			console.error('Error fetching station status from the API: %s', statusResponse.status);
			throw error(500, genericErrorMessage);
		}

		const [stationsJson, statusJson] = await Promise.all([
			stationsResponse.json(),
			statusResponse.json()
		]);

		const stations = mapStationData(stationsJson.data.stations, statusJson.data.stations);

		return { stations };
	} catch (e) {
		const message = e instanceof Error ? e.message : e;
		console.error(`${genericErrorMessage}: ${message}`);
		throw error(500, genericErrorMessage);
	}
};
