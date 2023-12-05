import { context } from "./internal/context";
import { Validator } from "./internal/validator";
import { IField, ISchemaOptions } from "./types";

const isDefined = Validator.isDefined;

export const Schema =
    (schema_type: "model" | "view") =>
    (name: string, options: ISchemaOptions = {}) =>
    (...fields: IField[]) => {
        const max_of_field_name_length = fields.reduce(
            (prev, curr) => (prev > curr.name.length ? prev : curr.name.length),
            0,
        );
        const max_of_field_type_length = fields.reduce(
            (prev, curr) => (prev > curr.type.length ? prev : curr.type.length),
            0,
        );

        options.comments?.forEach((comment) =>
            context.push(`\n///  ${comment}`),
        );
        context.push(`\n${schema_type} ${name} {`);
        fields.forEach((field) => {
            field.comments.forEach((comment) =>
                context.push(`\n  ///  ${comment}`),
            );
            context.push(`\n  ${field.name.padEnd(max_of_field_name_length)} `);
            context.push(field.type.padEnd(max_of_field_type_length));
            field.attributes.forEach((attr) => context.push(" " + attr));
        });
        if (
            isDefined(options.index) ||
            isDefined(options.unique) ||
            isDefined(options.map) ||
            options.ignore
        )
            context.push("\n");
        if (options.index)
            context.push(`\n  @@index([${options.index.join(", ")}])`);
        if (options.unique)
            context.push(`\n  @@unique([${options.unique.join(", ")}])`);
        if (options.map !== undefined)
            context.push(`\n  @@map("${options.map}")`);
        if (options.ignore) context.push(`\n  @@ignore`);
        context.push("\n}\n");
    };

export const Model = Schema("model");
export const View = Schema("view");
export const Enum =
    (name: string) =>
    (...items: string[]) =>
        context.push(
            `\nenum ${name} {${items
                .map((item) => "\n  " + item)
                .join("")}\n}\n`,
        );
