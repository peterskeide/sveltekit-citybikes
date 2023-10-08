<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { DivIcon, DivIconOptions, Map, Marker } from 'leaflet';
	import type { DisplayMode, Station } from '$lib/types';

	export let data: PageData;

	let mapContainer: HTMLElement;
	let mapInstance: Map;
	let markers: Marker[];
	let displayMode: DisplayMode = 'bikes';
	let divIcon: (options?: DivIconOptions) => DivIcon;
	let popupTemplate: HTMLTemplateElement;

	onMount(() => {
		async function initMap() {
			// Leaflet does not support SSR, so we load it in a browser context.
			const leaflet = await import('leaflet');

			divIcon = leaflet.divIcon;

			mapInstance = leaflet.map(mapContainer).setView([59.91255818026415, 10.746883295044363], 15);

			leaflet
				.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				})
				.addTo(mapInstance);

			markers = data.stations.map((station) =>
				leaflet
					.marker([station.lat, station.lon], { title: station.name })
					.setIcon(createMarkerIcon(station.numBikesAvailable))
					.bindPopup(renderPopup(station))
					.addTo(mapInstance)
			);
		}

		initMap();

		return () => {
			if (mapInstance) {
				mapInstance.remove();
			}
		};
	});

	// Leaflet does not play too well with modern frameworks, so we
	// use a couple of "old school" render functions for icons and popups.
	function createMarkerIcon(value: number): DivIcon {
		let classNames = 'marker-icon-content';

		if (value === 0) {
			classNames = classNames + ' marker-icon-content--zero';
		}

		return divIcon({
			html: `<div class="${classNames}">${value}</div>`,
			iconSize: undefined
		});
	}

	function renderPopup(station: Station): string {
		const availableBikes = station.isRenting ? station.numBikesAvailable : 0;
		const availableDocks = station.isReturning ? station.numDocksAvailable : 0;

		return popupTemplate.innerHTML
			.replace('$ID', station.id)
			.replace('$NAME', station.name)
			.replace('$BIKES', availableBikes.toString())
			.replace('$DOCKS', availableDocks.toString());
	}

	// Update markers to show available bikes or docks,
	// depending on the chosen display mode.
	function switchDisplayMode(selectedDisplayMode: DisplayMode) {
		displayMode = selectedDisplayMode;

		switch (displayMode) {
			case 'bikes': {
				data.stations.forEach((station, index) => {
					markers[index].setIcon(createMarkerIcon(station.numBikesAvailable));
				});
				break;
			}
			case 'docks': {
				data.stations.forEach((station, index) => {
					markers[index].setIcon(createMarkerIcon(station.numDocksAvailable));
				});
				break;
			}
		}
	}
</script>

<svelte:head>
	<title>SvelteKit Citybikes</title>
</svelte:head>

<header>
	<span class="logo">Osly City Bike Stands</span>
	<button
		id="bikes-button"
		disabled={displayMode === 'bikes'}
		type="button"
		on:click={() => switchDisplayMode('bikes')}
	>
		Bikes
	</button>
	<button
		id="docks-button"
		disabled={displayMode === 'docks'}
		type="button"
		on:click={() => switchDisplayMode('docks')}
	>
		Docks
	</button>
</header>

<main class="map" bind:this={mapContainer} />

<template id="popup-template" bind:this={popupTemplate}>
	<div id="station-$ID">
		<span class="station-name">$NAME</span>
		<table class="station-table">
			<tr>
				<td>Available bikes</td><td class="available-bikes">$BIKES</td>
			</tr>
			<tr>
				<td>Available docks</td><td class="available-docks">$DOCKS</td>
			</tr>
		</table>
	</div>
</template>

<style>
	@import 'leaflet/dist/leaflet.css';

	:global(body) {
		margin: 0;
		font-family: Arial, Helvetica, sans-serif;
	}

	:global(.leaflet-marker-icon) {
		border-radius: 50%;
		width: 24px;
		height: 24px;
		overflow: hidden;
	}

	:global(.marker-icon-content) {
		width: 100%;
		height: 100%;
		text-align: center;
		padding-top: 3px;
		background-color: #2196f3;
		color: white;
	}

	:global(.marker-icon-content--zero) {
		background-color: #aaa;
	}

	header {
		padding: 1rem;
		background-color: black;
		color: white;
	}

	.logo {
		font-size: 1.2rem;
		display: inline-block;
		margin-right: 1rem;
	}

	button {
		padding: 5px;
		cursor: pointer;
	}

	button[disabled] {
		color: white;
	}

	.map {
		height: 100vh;
		width: 100vw;
	}

	.station-name {
		display: block;
		width: 100%;
		font-weight: 600;
		margin-bottom: 0.5rem;
		text-align: center;
	}

	.station-table {
		display: block;
		width: 10rem;
		padding: 0.5rem;
		border-collapse: collapse;
	}

	.station-table tr {
		border: 1px solid #aaa;
	}

	.station-table td {
		border: 1px solid #aaa;
		padding: 0.5rem;
		text-align: center;
	}
</style>
