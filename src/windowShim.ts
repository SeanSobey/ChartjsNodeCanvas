const requestAnimation = (() => {
	// tslint:disable-next-line: no-let
	let lastRunTimestamp = 0;
	// tslint:disable-next-line: no-let
	let scheduled = false;
	const secondInMillis = 1000;
	const frameRate = 30;
	const frameDuration = secondInMillis / frameRate;
	return (callback: (arg: number) => void) => {
		const now = Date.now();
		const runCallback = () => {
			scheduled = false;
			return callback(Date.now());
		};
		const difference = now - lastRunTimestamp;
		lastRunTimestamp = now;
		if (difference > frameDuration) {
			runCallback();
		} else {
			if (scheduled) {
				return;
			}
			scheduled = true;
			setTimeout(runCallback, frameDuration);
		}
	};
});

if (!('window' in global) || !global.window?.requestAnimationFrame) {
	global.window = {} as any; //{ requestAnimationFrame: requestAnimation() } as any;
}