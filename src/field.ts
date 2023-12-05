import { Validator } from "./internal/validator";
import {
    IBooleanOptions,
    IDateTimeOptions,
    IDecimalOptions,
    IDefaultOptions,
    IEnumOptions,
    IField,
    IIntOptions,
    IRelationOptions,
    IStringOptions,
} from "./types";

const isDefined = Validator.isDefined;

const defaultOptions = (field: IField, options: IDefaultOptions): IField => {
    if (isDefined(options.map)) field.attributes.push(`@map(${options.map})`);
    if (isDefined(options.raw)) field.attributes.push(options.raw);
    if (options.ignore) field.attributes.push("@ignore");
    return field;
};

const fieldType = (
    type: string,
    constraint?: "required" | "nullable" | "list",
): string =>
    type +
    (constraint === "nullable" ? "?" : constraint === "list" ? "[]" : "");

const _int =
    (type: "BigInt" | "Int") =>
    (name: string, options: IIntOptions = {}): IField => {
        const field: IField = {
            name,
            type: fieldType(type, options.constraint),
            comments: options.comments ?? [],
            attributes: [],
        };

        if (options.id) field.attributes.push("@id");
        else if (options.unique) field.attributes.push("@unique");

        if (isDefined(options.default))
            if (options.default.autoincrement)
                field.attributes.push("@default(autoincrement())");
            else field.attributes.push(`@default(${options.default.value})`);
        return defaultOptions(field, options);
    };

const boolean = (name: string, options: IBooleanOptions = {}): IField => {
    const field: IField = {
        name,
        type: fieldType("Boolean", options.constraint),
        comments: options.comments ?? [],
        attributes: [],
    };
    if (options.id) field.attributes.push("@id");
    else if (options.unique) field.attributes.push("@unique");
    if (isDefined(options.default))
        field.attributes.push(`@default(${options.default.value})`);
    return defaultOptions(field, options);
};

const _decimal =
    (type: "Decimal" | "Float") =>
    (name: string, options: IDecimalOptions = {}): IField => {
        const field: IField = {
            name,
            type: fieldType(type, options.constraint),
            comments: options.comments ?? [],
            attributes: <string[]>[],
        };
        if (options.id) field.attributes.push("@id");
        else if (options.unique) field.attributes.push("@unique");
        if (isDefined(options.default))
            field.attributes.push(`@default(${options.default.value})`);
        return defaultOptions(field, options);
    };

const string = (name: string, options: IStringOptions = {}): IField => {
    const field: IField = {
        name,
        type: fieldType("String", options.constraint),
        comments: options.comments ?? [],
        attributes: [],
    };
    if (options.id) field.attributes.push("@id");
    else if (options.unique) field.attributes.push("@unique");
    if (isDefined(options.default))
        if (options.default.uuid) field.attributes.push("@default(uuid())");
        else if (options.default.cuid)
            field.attributes.push("@default(cuid())");
        else field.attributes.push(`@default("${options.default.value}")`);
    return defaultOptions(field, options);
};

const datetime = (name: string, options: IDateTimeOptions = {}): IField => {
    const field: IField = {
        name,
        type: fieldType("DateTime", options.constraint),
        comments: options.comments ?? [],
        attributes: [],
    };
    if (options.id) field.attributes.push("@id");
    else if (options.unique) field.attributes.push("@unique");
    if (isDefined(options.default))
        if (options.default.now) field.attributes.push("@default(now())");
        else
            field.attributes.push(
                `@default("${options.default.value.toISOString()}")`,
            );
    if (options.updatedAt) field.attributes.push("@updatedAt");
    return defaultOptions(field, options);
};

const relation = (name: string, options: IRelationOptions = {}): IField => {
    const field: IField = {
        name,
        type: fieldType(options.model ?? name, options.constraint),
        comments: options.comments ?? [],
        attributes: [],
    };
    const relations: string[] = [];
    if (isDefined(options.name)) relations.push(`name: "${options.name}"`);
    if (isDefined(options.fields))
        relations.push(`fields: [${options.fields.join(", ")}]`);
    if (isDefined(options.references))
        relations.push(`references: [${options.references.join(", ")}]`);
    if (isDefined(options.onUpdate))
        relations.push(`onUpdate: ${options.onUpdate}`);
    if (isDefined(options.onDelete))
        relations.push(`onUpdate: ${options.onDelete}`);
    if (relations.length > 0)
        field.attributes.push(`@relation(${relations.join(", ")})`);
    return defaultOptions(field, options);
};

export const Field = {
    bigint: _int("BigInt"),
    int: _int("Int"),
    boolean,
    decimal: _decimal("Decimal"),
    float: _decimal("Float"),
    string,
    datetime,
    relation,
    enum: (name: string, options: IEnumOptions = {}): IField => {
        const field: IField = {
            name,
            type: fieldType(options.enum ?? name, options.constraint),
            comments: options.comments ?? [],
            attributes: [],
        };
        if (options.id) field.attributes.push("@id");
        else if (options.unique) field.attributes.push("@unique");
        if (isDefined(options.default))
            field.attributes.push(`@default(${options.default.value})`);
        return defaultOptions(field, options);
    },
} as const;
