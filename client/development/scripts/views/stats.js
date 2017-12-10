import View from "ampersand-view";

import StatsCollection from "../models/stats";
import StatNumericMiniView from "./stat_numeric_mini";
import StatLinechartMiniView from "./stat_line_mini";
import StatBarchartMiniView from "./stat_bar_mini";
import StatHorizontalPercentageBarchartMiniView from "./stat_bar_horizontal-percentage_mini";

const StatsView = View.extend({
	template: `
		<section class="stats-section">
			<main data-hook="stats-holder"></main>
		</section>
	`,
	render() {
		this.renderWithTemplate(this);

		/* eslint-disable prefer-arrow-callback*/
		this.renderCollection(this.stats, function(opts) {
			const {model} = opts;

			switch (model.data.type) {
				case "numeric":
					return new StatNumericMiniView(opts);
				case "line":
					return new StatLinechartMiniView(opts);
				case "bar":
					return new StatBarchartMiniView(opts);
				case "percentage":
					return new StatHorizontalPercentageBarchartMiniView(opts);
				default:
					break;
			}
		}, this.queryByHook("stats_holder"));

		/* eslint-enable prefer-arrow-callback*/

		return this;
	},
	stats: new StatsCollection()
});

export default StatsView;
