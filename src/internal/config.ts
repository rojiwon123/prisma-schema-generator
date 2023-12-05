import fs from "fs";
import path from "path";

import { IConfiguration } from "../types";
import { Validator } from "./validator";

/** @internal */
export namespace Configuration {
    const parse = async (location: string): Promise<IConfiguration> => {
        if (!fs.existsSync(location))
            throw Error(`can not find module at ${location}`);
        const json = (await import(location))?.default;
        Validator.assertConfiguration(json);
        return json;
    };

    export const find = () => {
        const idx = process.argv.findIndex(
            (val) => val === "-c" || val === "--config",
        );
        const resolved = path.resolve(
            (idx === -1 ? "psg.config.ts" : process.argv[idx + 1]) ??
                "psg.config.ts",
        );
        return parse(resolved);
    };
}
