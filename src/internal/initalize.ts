import { IConfiguration, IGenerator } from "../types";
import { context } from "./context";
import { Validator } from "./validator";

/** @internal */
export const initDatasoure = (config: IConfiguration) => {
    context.push(`datasource ${config.datasource.name ?? "database"} {\n`);
    context.push(`  provider = "${config.datasource.provider}"\n`);
    const url = Validator.isString(config.datasource.url)
        ? `"${config.datasource.url}"`
        : `env("${config.datasource.url.env}")`;
    context.push(`  url      = ${url}\n`);
    context.push("}\n");
};

/** @internal */
export const initGenerator = (generator: IGenerator) => {
    context.push(`\ngenerator ${generator.name ?? "db"} {\n`);

    const max_of_key_length = Object.keys(generator).reduce(
        (prev, curr) => (prev > curr.length ? prev : curr.length),
        0,
    );
    Object.entries(generator).forEach(([key, value]) => {
        if (key === "name") return;
        const val = Validator.isString(value)
            ? `"${value}"`
            : Validator.isStringArray(value)
              ? `[${value.map((item) => `"${item}"`).join(", ")}]`
              : Validator.isObject(value)
                ? `env("${value.env}")`
                : value;

        context.push(`  ${key.padEnd(max_of_key_length)} = ${val}\n`);
    });
    context.push("}\n");
};
