import psg, { Field } from "../bin";

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
