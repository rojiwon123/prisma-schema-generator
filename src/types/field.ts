export interface IDefaultOptions {
    comments?: string[];
    map?: string;
    raw?: string;
    ignore?: boolean;
}

interface IIdOptions<T> {
    constraint?: "required";
    id: true;
    unique?: true;
    default?: T;
}

interface IAotomicOptions<T> {
    constraint?: "required" | "nullable";
    id?: false;
    unique?: boolean;
    default?: T;
}

interface IListOptions {
    constraint: "list";
    id?: false;
    unique?: false;
    default?: undefined;
}

type IFieldBaseOptions<T> = IDefaultOptions &
    (IIdOptions<T> | IAotomicOptions<T> | IListOptions);

export type IBooleanOptions = IFieldBaseOptions<{ value: boolean }>;

export type IIntOptions = IFieldBaseOptions<
    | { value: number; autoincrement?: false }
    | { value?: undefined; autoincrement: true }
>;

export type IDecimalOptions = IFieldBaseOptions<{ value: number }>;
export type IDateTimeOptions = IFieldBaseOptions<
    { value: Date; now?: false } | { value?: undefined; now: true }
> &
    (
        | {
              constraint?: "required" | "nullable";
              updatedAt?: boolean;
          }
        | { constraint: "list"; updatedAt?: undefined }
    );

export type IEnumOptions = IFieldBaseOptions<{ value: string }> & {
    enum?: string;
};
export type IStringOptions = IFieldBaseOptions<
    | {
          value: string;
          uuid?: false;
          cuid?: false;
      }
    | { value?: undefined; uuid: true; cuid?: false }
    | { value?: undefined; uuid?: false; cuid: true }
>;

export type RelationActionType =
    | "Cascade"
    | "Restrict"
    | "NoAction"
    | "SetNull"
    | "SetDefault";

export type IRelationOptions = {
    ignore?: boolean;
    constraint?: "required" | "nullable" | "list";
    model?: string;
    name?: string;
    onUpdate?: RelationActionType;
    onDelete?: RelationActionType;
} & (
    | {
          fields: string[];
          references: string[];
      }
    | { fields?: undefined; references?: undefined }
);

export interface ISchemaOptions {
    comments?: string[];
    map?: string;
    ignore?: boolean;
    index?: string[];
    unique?: string[];
}

export interface IField {
    readonly name: string;
    readonly type: string;
    readonly attributes: string[];
    readonly comments: string[];
}
