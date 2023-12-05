import type { IConfiguration } from "../bin";

export const config: IConfiguration = {
    input: "example",
    output: "example/schema.prisma",
    datasource: {
        provider: "postgresql",
        url: { env: "DATABASE_URL" },
    },
    generators: [
        {
            name: "db",
            provider: "prisma-client-js",
            output: "../db",
        },
        {
            name: "erd",
            provider: "prisma-markdown",
            output: "../ERD.md",
            title: "Template",
        },
    ],
};

export default config;
