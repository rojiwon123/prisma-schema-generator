# Prisma Schema Generator

![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## Install

```bash
npm i @rojiwon123/prisma-schema-generator
```

> **Warning** this is a private library.

## Example

```ts
import type { IConfiguration } from "@rojiwon123/prisma-schema-generator";

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
```

```ts
import psg, { Enum, Field } from "@rojiwon123/prisma-schema-generator";

Enum("OauthType")("github", "kakao", "naver");

psg.Model("User", {
    comments: ["Root Entity of User"],
    map: "users",
    index: ["created_at"],
})(
    Field.string("id", {
        id: true,
        raw: "@database.Uuid",
        comments: ["'uuid' type"],
    }),
    Field.string("name", { comments: ["displayed name of user"] }),
    Field.enum("OauthType", {
        constraint: "nullable",
        default: { value: "github" },
    }),
    Field.datetime("created_at"),
    Field.datetime("updated_at", {
        constraint: "nullable",
        updatedAt: true,
    }),
    Field.relation("articles", {
        model: "Article",
        constraint: "list",
    }),
);

psg.Model("Article", { map: "articles", index: ["created_at"] })(
    Field.int("id", {
        id: true,
        default: { autoincrement: true },
    }),
    Field.string("title"),
    Field.string("body"),
    Field.string("author_id", { raw: "@database.Uuid" }),
    Field.relation("author", {
        model: "User",
        fields: ["author_id"],
        references: ["id"],
    }),
    Field.datetime("created_at"),
    Field.datetime("updated_at", {
        constraint: "nullable",
        updatedAt: true,
    }),
);
```

```bash
npx @rojiwon123/prisma-schema-generator
```

[Generated Schema File](./example/schema.prisma)
