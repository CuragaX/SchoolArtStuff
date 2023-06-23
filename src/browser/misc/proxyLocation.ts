import { prefix } from "config";

import afterPrefix from "shared/afterPrefix";

const proxyLocation = () => new URL(afterPrefix(location.href));
const upToProxyOrigin = () => prefix + proxyLocation().origin;

// Prevent detection by instanceof
let inheritedObject = {};
Reflect.setPrototypeOf(inheritedObject, Location.prototype);

const wrap = url => prefix + url;
const locationProxy = new Proxy(inheritedObject, {
	get(target, prop) {
		function internal() {
			if (typeof target[prop] === "function") {
				const props = {
					toString: () => proxyLocation().toString(),
					assign: url => window.location.assign(wrap(url)),
					replace: url => window.location.replace(wrap(url)),
				};

				return prop in props ? props[prop] : target[prop];
			}

			const fakeUrl = proxyLocation;

			const customProps = {
				ancestorOrigins: window.location.ancestorOrigins,
			};

			if (prop in customProps) return customProps[prop];

			if (prop in fakeUrl) return fakeUrl[prop];

			return location[prop];
		}

		const ret = internal();

		//console.log(`@Loc ${prop}: ${ret}`);

		return ret;
	},
	set(target, prop, value) {
		if (prop === "pathname" || (prop === "href" && value.startsWith("/")))
			target[prop] = upToProxyOrigin + value;
		else target[prop] = value;

		return true;
	},
});

export { locationProxy as default, proxyLocation, upToProxyOrigin };
