#!/usr/bin/env node
import fs from "fs";
import { register } from "ts-node";
import ts from "typescript";

import { Configuration } from "./config";
import { context } from "./context";
import { finder } from "./finder";
import { importSync } from "./importSync";
import { initDatasoure, initGenerator } from "./initalize";
import { Validator } from "./validator";

const loadTs = () => {
    const tsConfigPath = ts.findConfigFile(
        process.cwd(),
        ts.sys.fileExists,
        "tsconfig.json",
    );
    const { config } = ts.readConfigFile(
        tsConfigPath ?? "../../tsconfig.json",
        ts.sys.readFile,
    );
    register({
        emit: false,
        compilerOptions: config.compilerOptions,
        ...(Validator.isString(config?.compilerOptions?.baseUrl)
            ? ["tsconfig-paths/register"]
            : undefined),
    });
};

const execute = async () => {
    loadTs();
    const config = await Configuration.find();
    const files = await finder(config.input);
    initDatasoure(config);
    config.generators.forEach(initGenerator);
    files.forEach(importSync);
    fs.writeFileSync(config.output, context.join(""), "utf-8");
    process.exit(0);
};

execute().catch((err) => {
    console.log(err);
    process.exit(-1);
});
