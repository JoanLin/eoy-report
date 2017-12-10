//import app from "ampersand-app";
import AmpersandRouter from "ampersand-router";

//import StartPage from "./views/start";
//import StatsPage from "./views/stats";
//import MapsPage from "./views/maps";
//import MapsLegendPage from "./views/maps-legend";

import CoffeeStatsPage from "./views/stats_coffee";
//import CyclingStatsPage from "./views/stats_cycling";
//import BeerStatsPage from "./views/stats_beer";
//import HealthStatsPage from "./views/stats_health";

//const DEFAULT_TITLE = "Daniel's Twenty Seventeen";

const Router = AmpersandRouter.extend({
	routes: {
		"": "start",
		"coffee": "coffee",
		"cycling": "cycling",
		"walking": "walking",
		"audio-video": "av",
		"beer": "beer",
		"health": "health"
	},
	start: function() {

		//noop
	},
	coffee() {
		const view = new CoffeeStatsPage({});

		view.stats.add([
			{
				title: "Total coffees",
				data: {
					type: "numeric",
					value: 324
				}
			},
			{
				title: "Cumulative coffees",
				data: {
					type: "line",
					value: [1,
						2,
						3,
						4,
						5,
						6,
						7,
						7,
						9,
						10,
						11,
						12,
						13,
						14,
						15,
						16,
						17,
						18,
						19,
						20,
						21,
						21,
						22,
						23,
						24,
						25,
						26,
						26,
						27,
						28,
						29,
						30,
						31,
						32,
						33,
						33,
						34,
						36,
						37,
						38,
						39,
						40,
						41,
						42,
						44,
						46,
						47,
						48,
						49,
						50,
						52,
						53,
						54,
						55,
						56,
						57,
						58,
						59,
						60,
						62,
						64,
						65,
						67,
						67,
						68,
						69,
						70,
						71,
						72,
						72,
						73,
						74,
						75,
						77,
						78,
						79,
						80,
						80,
						81,
						82,
						84,
						85,
						86,
						87,
						88,
						89,
						91,
						92,
						93,
						94,
						94,
						94,
						95,
						96,
						97,
						98,
						99,
						99,
						99,
						101,
						102,
						103,
						104,
						105,
						105,
						106,
						106,
						107,
						108,
						109,
						110,
						112,
						112,
						113,
						114,
						115,
						116,
						117,
						118,
						118,
						119,
						121,
						122,
						123,
						125,
						126,
						126,
						127,
						128,
						129,
						130,
						131,
						132,
						133,
						133,
						134,
						135,
						136,
						137,
						138,
						139,
						140,
						141,
						142,
						143,
						143,
						144,
						145,
						146,
						147,
						148,
						149,
						150,
						150,
						151,
						152,
						153,
						154,
						155,
						156,
						156,
						156,
						157,
						158,
						159,
						160,
						161,
						162,
						163,
						165,
						166,
						167,
						168,
						169,
						171,
						171,
						172,
						173,
						174,
						175,
						176,
						176,
						176,
						177,
						178,
						179,
						180,
						181,
						182,
						182,
						183,
						184,
						185,
						186,
						188,
						189,
						190,
						191,
						192,
						193,
						194,
						195,
						196,
						197,
						198,
						199,
						200,
						201,
						202,
						203,
						203,
						204,
						205,
						206,
						207,
						208,
						209,
						210,
						211,
						213,
						214,
						215,
						216,
						217,
						218,
						219,
						220,
						221,
						222,
						223,
						224,
						224,
						225,
						226,
						227,
						228,
						229,
						230,
						231,
						232,
						233,
						234,
						235,
						236,
						236,
						237,
						237,
						238,
						238,
						239,
						240,
						241,
						241,
						242,
						243,
						244,
						245,
						246,
						247,
						247,
						248,
						249,
						250,
						252,
						254,
						256,
						257,
						259,
						261,
						262,
						263,
						264,
						266,
						266,
						266,
						267,
						268,
						269,
						270,
						270,
						270,
						271,
						272,
						273,
						274,
						275,
						275,
						275,
						277,
						278,
						280,
						281,
						282,
						282,
						282,
						283,
						284,
						285,
						286,
						287,
						288,
						288,
						289,
						290,
						291,
						292,
						293,
						293,
						293,
						294,
						295,
						296,
						297,
						297,
						299,
						299,
						300,
						301,
						302,
						303,
						304,
						304,
						304,
						305,
						306,
						307,
						308,
						309,
						309,
						310,
						311,
						312,
						313,
						314,
						315,
						316,
						317,
						318,
						319,
						320,
						321,
						322,
						323]
				}
			},
			{
				title: "Top coffee shops",
				data: {
					type: "percentage",
					value: [
						["Hopper", 24],
						["Manic", 19],
						["Voodoo Child", 14],
						["Pamenar", 4],
						["Jimmy's", 3]
					]
				}
			},
			{
				title: "Coffees per day of week",
				data: {
					type: "bar",
					value: /*[0,1,2,1,1,1,0,1,4,0,3,2,1,1,2,1,2,4,2,2,1,3,0,0,2,1,3,2,3,1,1,1,1,0,0,3,1,2,2,0,0,1,4,1,1,1,2,1,1,3,4,2,1,0,1,1,1,1,1,0,2,0,2,0,0,0,4,0,1,1,3,1,2,2,4,2,2,2,0,2,3,0,1,2,3,1,1,1,2,1,1,3,1,2,2,5,1,4,3,1,3,1,1,3,4,2,8,1,2,4,0,1,8,1,1,1,2,4,3,3,2,10,2,1,2,2,1,7,4,1,2,1,6,2,3,1,3,2,4,4,7,4,3,3,1,2,2,2,4,0,0,7,4,1,9,0,4,2,1,2,4,6,3,3,1,1,2,3,3,1,3,3,4,1,1,4,3,6,2,4,2,5,2,2,4,2,2,3,3,4,1,3,1,2,7,3,4,1,2,2,0,3,2,4,6,3,1,4,1,4,5,2,5,3,2,2,2,4,2,3,1,2,2,9,2,1,3,1,3,3,3,4,5,2,1,1,5,4,2,2,3,2,3,1,2,9,2,7,3,2,5,4,2,1,2,1,3,0,3,6,4,5,3,4,1,1,3,2,1,1,2,2,8,2,5,5,1,2,2,2,3,1,2,2,1,7,2,2,5,1,2,3,5,1,1,12,2,1,1,2,2,7,2,1,1,2,2,1,5,1,4,5,3,4,1,1,1,4,2,1,1,5,4,1,2,1,2,2,2,1,5,2,0,2,2,6,1,6,2,1,8,2,1,1,1,3,3,0,1,1,2,2,1,2,0,4,1,1,1,2,1,4,0,0,1,2,5]*/[37,40,39,36,36,29.5,19.25]
				}
			}
		]);

		this.trigger("newPage", view);
		this.trigger("navigation");
	},
	cycling() {
		const view = new CyclingStatsPage();

		this.trigger("newPage", view);
		this.trigger("navigation");
	},
	beer() {
		const view = new BeerStatsPage({});

		this.trigger("newPage", view);
		this.trigger("navigation");
	},
	health() {
		const view = new HealthStatsPage({});

		this.trigger("newPage", view);
		this.trigger("navigation");
	}
});

export default Router;
