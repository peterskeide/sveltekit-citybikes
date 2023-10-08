import { expect, test } from '@playwright/test';

test.beforeEach(async () => {
	await fetch('http://localhost:9000/__admin/mappings/reset', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	});
});

test('index page has a map', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.map')).toBeVisible();
});

test('map has 260 markers', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('div.leaflet-marker-icon')).toHaveCount(260);
});

test('clicking marker opens popup with station data', async ({ page }) => {
	await page.goto('/');
	await page.locator('div[title=Universitetsgata]').click();
	await expect(page.locator('#station-2337')).toBeVisible();
	await expect(page.locator('.available-bikes')).toHaveText('12');
	await expect(page.locator('.available-docks')).toHaveText('3');
});

test('markers show number of available bikes by default', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('div[title=Stjerneplassen] .marker-icon-content')).toHaveText('15');
});

test('clicking "Docks" button switches markers to display number of docks', async ({ page }) => {
	await page.goto('/');
	await page.locator('#docks-button').click();
	await expect(page.locator('div[title=Stjerneplassen] .marker-icon-content')).toHaveText('0');
});

test('clicking "Docks" followed by "Bikes" button switches markers to display number of bikes', async ({
	page
}) => {
	await page.goto('/');
	await page.locator('#docks-button').click();
	await page.locator('#bikes-button').click();
	await expect(page.locator('div[title=Stjerneplassen] .marker-icon-content')).toHaveText('15');
});

test('renders error message when the API is failing', async ({ page }) => {
	await fetch('http://localhost:9000/__admin/mappings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			request: {
				method: 'GET',
				url: '/oslobysykkel.no/station_information.json'
			},
			response: {
				status: 500
			}
		})
	});

	await page.goto('/');
	await expect(page.getByText('Apologies, we are having some server issues.')).toBeVisible();
});
