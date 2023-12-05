/** @internal */
export const importSync = (location: string): any => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const required = require(location);
    if (required && required.__esModule) return required;
    throw Error(`can not find module at ${location}`);
};
