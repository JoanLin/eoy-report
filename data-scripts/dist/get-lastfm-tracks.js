"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const assert = require("assert");
const path = require("path");
const minimist = require("minimist");
const moment = require("moment");
const LastFMAPI = require("lastfmapi");
const util_1 = require("util");
const args = minimist(process.argv.slice(2));
const { _: [outFile], c: configPath = "../../data/lastfm_config.json", year = (new Date().getFullYear()) } = args;
assert.ok(outFile, "Missing output file argument");
const writePath = path.join(process.cwd(), outFile);
const lastFMConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, configPath), "utf8"));
const lastfm = new LastFMAPI(lastFMConfig);
const asyncWriteFile = util_1.promisify(fs.writeFile);
const asyncGetRecentTracks = util_1.promisify(lastfm.user.getRecentTracks.bind(lastfm.user));
const startDate = moment("2017-01-01").startOf("year");
const endDate = startDate.clone().endOf("year");
const main = async () => {
    const fromTimestamp = startDate.unix();
    const endTimestamp = endDate.unix();
    const allTracks = [];
    let page = 1;
    while (true) {
        const results = await asyncGetRecentTracks({
            user: "kmkldude",
            from: fromTimestamp,
            to: endTimestamp,
            limit: 200,
            page
        });
        console.log("got page %d", page);
        const pageTracks = results.track;
        allTracks.push(...pageTracks.map(item => ({
            name: item.name,
            timestamp: Number(item.date.uts),
            album: item.album["#text"],
            artist: item.artist["#text"]
        })));
        if (!pageTracks.length || page >= parseInt(results["@attr"].totalPages, 10)) {
            break;
        }
        page++;
    }
    const data = JSON.stringify(allTracks, null, "\t");
    await asyncWriteFile(outFile, data);
};
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWxhc3RmbS10cmFja3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZ2V0LWxhc3RmbS10cmFja3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUViLHlCQUF5QjtBQUN6QixpQ0FBaUM7QUFDakMsNkJBQTZCO0FBQzdCLHFDQUFxQztBQUNyQyxpQ0FBaUM7QUFFakMsdUNBQXVDO0FBQ3ZDLCtCQUFpQztBQUVqQyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxNQUFNLEVBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsR0FBRywrQkFBK0IsRUFBRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUMsR0FBRyxJQUFJLENBQUM7QUFFaEgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsOEJBQThCLENBQUMsQ0FBQztBQUVuRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNwRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM5RixNQUFNLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUUzQyxNQUFNLGNBQWMsR0FBRyxnQkFBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQyxNQUFNLG9CQUFvQixHQUFHLGdCQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRXRGLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkQsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQTZCaEQsTUFBTSxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDdkIsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxNQUFNLFNBQVMsR0FBbUIsRUFBRSxDQUFDO0lBQ3JDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztJQUViLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDYixNQUFNLE9BQU8sR0FBRyxNQUFNLG9CQUFvQixDQUFDO1lBQzFDLElBQUksRUFBRSxVQUFVO1lBQ2hCLElBQUksRUFBRSxhQUFhO1lBQ25CLEVBQUUsRUFBRSxZQUFZO1lBQ2hCLEtBQUssRUFBRSxHQUFHO1lBQ1YsSUFBSTtTQUNKLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWpDLE1BQU0sVUFBVSxHQUFrQixPQUFPLENBQUMsS0FBSyxDQUFDO1FBRWhELFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN6QyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ2hDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUMxQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7U0FDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVMLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQSxDQUFDO1lBQzVFLEtBQUssQ0FBQztRQUNQLENBQUM7UUFFRCxJQUFJLEVBQUUsQ0FBQztJQUNSLENBQUM7SUFFRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFbkQsTUFBTSxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQztBQUVGLElBQUksRUFBRSxDQUFDIn0=