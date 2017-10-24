
import * as fs from "fs";
import * as path from "path";
import * as assert from "assert";
import {promisify} from "util";
import * as strava from "strava-v3";
import * as async from "async";
import * as polyline from "polyline";
import * as minimist from "minimist";

const args = minimist(process.argv.slice(2));
const {_: [outFile], c: configPath = "../../data/strava_config.json", year = (new Date().getFullYear())} = args;

assert.ok(outFile, "Missing output file argument");

const stravaConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, configPath), "utf8"));

const asyncListActivities = promisify(strava.athlete.listActivities.bind(strava.athlete));
const asyncWriteFile = promisify(fs.writeFile);

interface RideBase {
	id: number;
	name: string;
	distance: number;
	moving_time: number;
	elapsed_time: number;
	total_elevation_gain: number;
	start_date_local: Date;
	average_speed: number;
	max_speed: number;
	calories: number;
}

const targetRideKeys = ["id", "name", "distance", "moving_time", "elapsed_time", "total_elevation_gain", "start_date_local", "average_speed", "max_speed", "calories"];

const padRec = (value: string, paddingNumber: number, length: number) => value.length >= length ? value : padRec(`${paddingNumber}${value}`, paddingNumber, length);

const getRideIdsForYear = async (year: number) => {
	const ride_ids: RideBase["id"][] = [];
	const startOfYear = new Date(year, 0, 1);
	const endOfYear = new Date(year, 11, 31, 23, 59, 59);

	const testForYear = (ride: RideBase) => (
		ride.start_date_local > startOfYear &&
		ride.start_date_local < endOfYear
	);

	let outOfBounds = false;
	let retrievalPage = 1;

	while (!outOfBounds) {
		let ridesRaw;
		try {
			ridesRaw = await asyncListActivities({
				page: retrievalPage,
				per_page: 200,
				access_token: stravaConfig.access_token
			});
		} catch (e) {
			if (!(e instanceof Error)) {
				e = new Error(e.message);
			}

			throw e;
		}

		const rides = ridesRaw
		.map(({id, name, distance, moving_time, elapsed_time, total_elevation_gain, start_date_local, average_speed, max_speed, calories}) => {
			const ride: RideBase = {
				id,
				start_date_local: new Date(start_date_local),
				name,
				distance,
				moving_time,
				elapsed_time,
				total_elevation_gain,
				average_speed,
				max_speed,
				calories
			};

			return ride
		})
		.filter(testForYear);

		const ids = rides
		.map(({id}) => id);

		ride_ids.push(...ids);

		console.log("page %d; retrieved %d rides.", retrievalPage, ids.length);

		retrievalPage++;

		const lastRide = rides[rides.length - 1];

		outOfBounds = !(lastRide && testForYear(lastRide)) || rides.length < 200;
	}

	const data = JSON.stringify(ride_ids, null, "\t");

	await asyncWriteFile(outFile, data);
};

/*
const simplifyRideData = (ride) => {
	const simple = {};

	targetRideKeys.forEach(key => (simple[key] = ride[key]));

	if (ride.map && ride.map.polyline) {
		simple.points = polyline.decode(ride.map.polyline);
		//reverse order of coords
		simple.points = simple.points.map(point => point.reverse());
	}

	return simple;
};
*/

/* const getRideById = (id, callback) => strava.activities.get({id}, (err, ride) => {

	if (err) {
		return callback(err);
	}

	if (ride.errors) {
		return callback(new Error(ride.message));
	}

	callback(null, simplifyRideData(ride));
}); */

/* const getRidesForYear = (offset = 0) => fs.readFile(rideIdsFilePath, "utf8", (err, data) => {

	if (err) {
		throw err;
	}

	let lastFetch = Date.now();
	const ride_ids = JSON.parse(data).slice(offset);
	const rides = [];

	async.eachOfLimit(ride_ids, 4, (ride_id, index, callback) => {
		lastFetch = new Date();

		getRideById(ride_id, (err, ride) => {

			if (err) {
				return callback(err);
			}

			index = padRec(index.toString(), "0", ride_ids.length.toString().length);

			let logLine = `#${index} [${(new Date()).toLocaleTimeString()}]: `;

			logLine += `Parsed "${ride.name}" (${(new Date(ride.start_date_local)).toLocaleDateString()})`;

			if (ride.points) {
				logLine += ` with ${ride.points.length} points`;
			}

			console.log(logLine);

			rides.push(ride);

			//wait at most 1s between fetches.
			setTimeout(callback, Math.max((lastFetch + 250) - Date.now(), 0));
		});
	}, (err) => {

		if (err) {
			console.error(err);
		}

		const ridesJSON = JSON.stringify(rides, null, "\t");

		fs.writeFile(ridesFilePath, ridesJSON, "utf8", (err) => console.log(err || "Done writing"));
	});
}); */

getRideIdsForYear(year)
.catch(err => {
	throw err
});
