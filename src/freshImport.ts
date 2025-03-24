// ES Module version of fresh-require
// export const freshImport = async (modulePath: string): Promise<any> => {
// 	// For ES modules, we need to construct the full URL
// 	const moduleUrl = new URL(modulePath, import.meta.url).href;

// 	// Clear module from import cache if possible
// 	// Note: ES modules caching works differently than CommonJS
// 	try {
// 	  // Force a new module instance by appending a cache-busting query parameter
// 	  const timestamp = Date.now();
// 	  const urlWithCacheBuster = `${moduleUrl}?cache=${timestamp}`;

// 	  // Dynamic import with cache buster
// 	  const module = await import(/* @vite-ignore */ urlWithCacheBuster);
// 	  return module;
// 	} catch (error) {
// 	  console.error(`Error importing module ${modulePath}:`, error);
// 	  throw error;
// 	}
// };
