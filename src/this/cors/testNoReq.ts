// This does the same as test.ts, but without increasing request volume
export default async (proxyUrl: string): Promise<boolean> => {
	// TODO: In order for this to work, I will need to make policy.ts a shared module, and use that to test the proxyUrl against the rules in place
	return false;
};
