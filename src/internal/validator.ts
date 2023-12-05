import { IConfiguration, IDatasource, IGenerator } from "../types";

/** @internal */
export namespace Validator {
    export const isUndefined = (input: unknown): input is undefined =>
        input === undefined;
    export const isDefined = <T>(input: T | undefined): input is T =>
        !isUndefined(input);
    export const isString = (input: unknown): input is string =>
        typeof input === "string";
    export const isArray =
        <T>(is: (input: unknown) => input is T) =>
        (input: unknown): input is T[] =>
            Array.isArray(input) && input.every(is);
    export const isStringArray = isArray(isString);
    export const isBoolean = (input: unknown): input is boolean =>
        typeof input === "boolean";
    export const isObject = (
        input: unknown,
    ): input is NonNullable<{ [key: string]: unknown }> =>
        typeof input === "object" && input !== null;

    export const and =
        <T>(...predicates: ((input: unknown) => boolean)[]) =>
        (input: unknown): input is T =>
            predicates.every((predicate) => predicate(input));
    export const or =
        <T>(...predicates: ((input: unknown) => boolean)[]) =>
        (input: unknown): input is T =>
            predicates.some((predicate) => predicate(input));
    export const include =
        <T>(list: readonly T[]) =>
        (input: any): input is T =>
            list.includes(input);

    export const assert: <T>(
        is: (input: unknown) => input is T,
        message: string,
        input: unknown,
    ) => asserts input is T = (is, message, input) => {
        if (!is(input)) throw Error(message);
    };

    const message = (subject: string, predicate: string) =>
        `${subject} should be ${predicate}.`;

    const assertDatasource: (input: unknown) => asserts input is IDatasource = (
        input,
    ) => {
        const providers = [
            "cockroachdb",
            "mongodb",
            "mysql",
            "postgresql",
            "sqlite",
            "sqlserver",
        ] as const;
        assert(isObject, message("datasource", "an object"), input);
        assert(
            or<string | undefined>(isString, isUndefined),
            message("datasource.name", "an optional string"),
            input["name"],
        );
        assert(
            include(providers),
            message(
                "datasource.provider",
                `an one of [${providers.join(", ")}]`,
            ),
            input["provider"],
        );
        assert(
            or<string | { env: string }>(
                isString,
                and(isObject, (input: any) => isString(input["env"])),
            ),
            message("datasource.url", "string or object"),
            input["url"],
        );
    };

    const assertGenerator: (
        input: unknown,
        index: number,
    ) => asserts input is IGenerator = (input, index) => {
        const isOptionalString = or<string | undefined>(isString, isUndefined);
        assert(isObject, message(`generators[${index}]`, "an object"), input);
        assert(
            isOptionalString,
            message(`generators[${index}].name`, "an optional string"),
            input["name"],
        );
        assert(
            isString,
            message(`generators[${index}].provider`, "a string"),
            input["provider"],
        );
        assert(
            isOptionalString,
            message(`generators[${index}].output`, "an optional string"),
            input["output"],
        );
        assert(
            or<string[] | undefined>(isStringArray, isUndefined),
            message(
                `generators[${index}].previewFeatures`,
                "an optional string array",
            ),
            input["previewFeatures"],
        );
        Object.entries(input).forEach(([key, value]) => {
            if (
                key === "name" ||
                key === "provider" ||
                key === "output" ||
                key === "previewFeatures"
            )
                return;
            assert(
                or(
                    isUndefined,
                    isString,
                    isStringArray,
                    isBoolean,
                    and(isObject, (input: any) => isString(input["env"])),
                ),
                `generators[${index}].${key} have invalid value`,
                value,
            );
        });
    };

    export const assertConfiguration: (
        input: unknown,
    ) => asserts input is IConfiguration = (input) => {
        assert(isObject, message("configuration", "an object"), input);
        assert(isString, message("input", "a string"), input["input"]);
        assert(isString, message("output", "a string"), input["output"]);
        if (!input["output"].endsWith(".prisma"))
            throw Error("output should be end with .prisma");
        assertDatasource(input["datasource"]);
        assert(
            Array.isArray,
            message("generators", "an array"),
            input["generators"],
        );
        const generators: IGenerator[] = input["generators"];
        if (generators.length === 0)
            throw Error("generators should be at least one.");
        generators.forEach(assertGenerator);

        if (
            generators.length > 1 &&
            generators.some((gen) => Validator.isUndefined(gen.name))
        )
            throw Error(
                "when there are multiple generators, every generator should have 'name' property.",
            );
    };
}
