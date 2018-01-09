"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const assert = require("assert");
const minimist = require("minimist");
const simple_statistics_1 = require("simple-statistics");
const interpolateLineRange = require("line-interpolate-points");
const simplify = require("simplify-js");
const TOLERANCE = 0.001;
const filterByGreaterDateOrGreaterIndexPosition = (walkA, walks) => (rideB, index) => {
    /*if (rideB.start_date_local_date) {
        return rideB.start_date_local_date > rideA.start_date_local_date;
    } else {*/
    return index > walks.indexOf(walkA);
    //}
};
const distanceDiffForTwoPaths = (a, b) => a
    .map((aPoint, index) => [aPoint, b[index]])
    .map(([[x1, y1], [x2, y2]], index, array) => {
    //calculate the difference between the points
    let diff = Math.hypot(x1 - x2, y1 - y2);
    //calculate the alpha along the line
    let alpha = index / array.length;
    //alpha is lower towards the ends of the line
    alpha = Math.min(alpha, 1 - alpha);
    return diff * (2 + alpha);
})
    .reduce((total, distance) => total + distance, 0);
const { _: [inFile, outFile] } = minimist(process.argv.slice(2));
assert.ok(inFile, "Missing input file argument");
const raw = fs.readFileSync(inFile, "utf8");
const walks = JSON.parse(raw);
assert.ok(Array.isArray(walks), "Data is not an array");
//walks.sort(({start_date_local_date: a}, {start_date_local_date: b}) => Number(a) - Number(b));
console.time("find dupes");
walks.forEach(walk => walk.points_interop = simplify(walk.points.map(([x, y]) => ({ x, y })), TOLERANCE, true).map(({ x, y }) => [x, y]));
//find a median point count for use in interpolation
const medianPointCount = simple_statistics_1.median(walks.map(walk => walk.points_interop.length));
//interpolate maps to use same # of points
walks.forEach((walk) => walk.points_interop = interpolateLineRange(walk.points_interop, medianPointCount));
const dupesMap = new Map();
//finds related walks
walks
    .map(walk => ({
    walk,
    diff: Math.abs(medianPointCount - walk.points_interop.length)
}))
    .sort(({ diff: a }, { diff: b }) => a - b)
    .map(({ walk }) => walk)
    .forEach((walkA, i, walks) => {
    const { points_interop: pathA } = walkA;
    const pathAReversed = pathA.slice(0).reverse();
    const dupeMapASet = dupesMap.get(walkA) || new Set();
    dupesMap.set(walkA, dupeMapASet);
    walks
        .filter(rideB => walkA !== rideB)
        .filter((rideB, index) => index > walks.indexOf(walkA))
        .forEach(walkB => {
        const { points_interop: pathB } = walkB;
        const dupeMapBSet = dupesMap.get(walkB) || new Set();
        dupesMap.set(walkB, dupeMapBSet);
        const distanceDiffs = [pathA, pathAReversed]
            .map(path => distanceDiffForTwoPaths(path, pathB))
            .map(diff => diff / medianPointCount);
        if (Math.min(...distanceDiffs) <= TOLERANCE) {
            dupeMapASet.add(walkB);
            dupeMapBSet.add(walkA);
        }
    });
});
console.timeEnd("find dupes");
console.time("prune dupes");
console.log("walks before de-duping", dupesMap.size);
for (const [parentWalk, parentRelatedWalks] of dupesMap) {
    const recursiveMergeAndDeleteRelatedWalk = (relatedWalks) => {
        for (const relatedWalk of relatedWalks) {
            const subrelatedWalks = dupesMap.get(relatedWalk);
            if (!subrelatedWalks) {
                break;
            }
            subrelatedWalks.delete(parentWalk);
            for (const subrelatedWalk of subrelatedWalks) {
                parentRelatedWalks.add(subrelatedWalk);
                for (const _walks of dupesMap.values()) {
                    if (
                    //two sets are the same
                    _walks === relatedWalks ||
                        _walks === parentRelatedWalks ||
                        _walks === subrelatedWalks) {
                        continue;
                    }
                    _walks.delete(subrelatedWalk);
                    _walks.delete(relatedWalk);
                    _walks.delete(parentWalk);
                }
                recursiveMergeAndDeleteRelatedWalk(subrelatedWalks);
            }
            ;
            //dupesMap.delete(relatedRide);
            dupesMap.delete(relatedWalk);
        }
    };
    recursiveMergeAndDeleteRelatedWalk(parentRelatedWalks);
}
console.log("walks after de-duping", dupesMap.size);
console.timeEnd("prune dupes");
const mostSimilarWalks = [...dupesMap.entries()]
    .map(([walk, walks]) => ({ walk, count: walks.size }));
mostSimilarWalks.sort(({ count: a }, { count: b }) => b - a);
/*
console.log();
console.group("Top 10 similar walks");
mostSimilarWalks.slice(0, 10)
.map((entry, index) => [index + 1, entry.walk.points, entry.count])
.forEach(line => console.log("%d: %s (%d)", ...line));
console.groupEnd();
*/
if (outFile) {
    console.log();
    console.group("Output");
    const walksArray = Array.from(dupesMap.keys()).map((walk) => ({
        points: walk.points.slice(0)
    }));
    const reducePoints = (total, { points }) => total + points.length;
    const originalPointCount = walksArray.reduce(reducePoints, 0);
    console.time("simplify walks");
    walksArray.forEach((walk) => {
        walk.points = simplify(walk.points.map(([x, y]) => ({ x, y })), 0.0001, true).map(({ x, y }) => [x, y]);
    });
    console.timeEnd("simplify walks");
    const finalPointCount = walksArray.reduce(reducePoints, 0);
    console.log(`simplified from ${originalPointCount} to ${finalPointCount} points`);
    fs.writeFileSync(outFile, JSON.stringify(walksArray, null, "\t"));
    console.log("outputed file");
    console.groupEnd();
}
//# sourceMappingURL=walks.js.map