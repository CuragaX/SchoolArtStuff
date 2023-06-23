import { proxyLocation } from "browser/misc/proxyLocation";

// Custom protocols
export default {
	get(scheme: string): string {
		return scheme.replace(
			new RegExp(`^(web+${proxyLocation().origin}+)`),
			"web+"
		);
	},
	set(scheme: string): string {
		let split = scheme.split("web+");

		split.splice(1, 0, `${proxyLocation().origin}+`);

		return split.join("");
	},
};
