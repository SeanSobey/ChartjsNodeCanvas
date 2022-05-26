const requestAnimation = (() => {
	// tslint:disable-next-line: no-let
	let lastRunTimestamp = 0;
	const secondInMillis = 1000;
	const frameRate = 60;
	const frameDuration = secondInMillis / frameRate;
	return (callback: (arg: number) => void) => {
		const now = Date.now();
		const runCallback = () => callback(performance.now());
		const difference = now - lastRunTimestamp;
		lastRunTimestamp = now;
		if (difference > frameDuration) {
			runCallback();
		} else {
			setTimeout(runCallback, frameDuration - difference);
		}
	};
});

if (!('window' in global) || !global.window.requestAnimationFrame) {
	global.window = { requestAnimationFrame: requestAnimation() } as any;
}