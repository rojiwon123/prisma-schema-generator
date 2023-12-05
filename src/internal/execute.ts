import fs from "fs";

import { Configuration } from "./config";
import { context } from "./context";
import { finder } from "./finder";
import { importSync } from "./importSync";
import { initDatasoure, initGenerator } from "./initalize";

const execute = async () => {
    const config = Configuration.find();
    const files = await finder(config.input);
    initDatasoure(config);
    config.generators.forEach(initGenerator);
    files.forEach(importSync);
    fs.writeFileSync(config.output, context.join(""), "utf-8");
};

void execute();
