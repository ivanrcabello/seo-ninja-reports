
// This module has been replaced with a simpler approach
// that doesn't require Playwright

export const getChromium = () => {
  throw new Error('Playwright is not supported in this environment');
};

export const getCustomArgs = () => {
  return [];
};
