import fs from "fs";
import path from "path";

import { IConfiguration } from "../types";
import { importSync } from "./importSync";
import { Validator } from "./validator";

/** @internal */
export namespace Configuration {
    const parse = (location: string): IConfiguration => {
        if (
            location.endsWith(".d.ts") ||
            !(
                location.endsWith(".js") ||
                location.endsWith(".ts") ||
                location.endsWith(".json")
            )
        )
            throw Error(
                "configuration file should be one of ['.js', '.ts', '.json'].",
            );

        if (!fs.existsSync(location))
            throw Error(`can not find module at ${location}`);

        const json = importSync(location).default;
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
