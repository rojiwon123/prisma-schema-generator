import fs from "fs";
import { glob } from "glob";
import path from "path";

const iterate = async (location: string): Promise<string[]> => {
    const stats = await fs.promises.stat(location);
    if (stats.isFile()) return [location];
    const dirs = await fs.promises.readdir(location);
    const result: string[] = [];
    for (const dir of dirs)
        result.push(...(await iterate(path.resolve(location, dir))));
    return result;
};

/** @internal */
export const finder = async (input: string): Promise<string[]> => {
    // find paths matched with wildcard
    const locations = await glob(path.resolve(input));

    const files: string[] = [];
    for (const location of locations) files.push(...(await iterate(location)));

    return files.filter(
        (file) =>
            (file.endsWith(".js") || file.endsWith(".ts")) &&
            !file.endsWith(".d.ts"),
    );
};
