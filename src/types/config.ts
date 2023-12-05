export interface IDatasource {
    name?: string;
    provider:
        | "cockroachdb"
        | "mongodb"
        | "mysql"
        | "postgresql"
        | "sqlite"
        | "sqlserver";
    url: string | { env: string };
}

export interface IGenerator {
    name?: string;
    provider: string;
    output?: string;
    previewFeatures?: string[];
    [key: string]: string | string[] | boolean | { env: string };
}

export interface IConfiguration {
    input: string;
    output: string;
    datasource: IDatasource;
    generators: IGenerator[];
}
