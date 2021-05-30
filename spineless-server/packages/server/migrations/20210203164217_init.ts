// import * as Knex from "knex";

// export async function up(knex: Knex): Promise<void> {
//   await knex.schema.createTable("ads", table => {
//     table
//       .string("adId", 200)
//       .notNullable()
//       .primary();

//     table.string("title");
//     table.string("sourceFilePath");
//     table.string("status");
//     table.float("durationSeconds");
//   });

//   await knex.schema.createTable("content", table => {
//     table
//       .string("contentId", 200)
//       .notNullable()
//       .primary();

//     table.string("title");
//     table.string("sourceFilePath");
//     table.string("status");
//     table.float("durationSeconds");
//     table.string("cuePoints");
//   });

//   await knex.schema.createTable("videos", table => {
//     table
//       .string("videoId", 200)
//       .notNullable()
//       .primary();

//     table.string("contentId").references("contentId").inTable("content");
//     table.string("adId").references("adId").inTable("ads");
//     table.integer("width");
//     table.integer("height");
//     table.string("format");
//     table.string("status");
//     table.string("workerThreadId");
//     table.string("assetPath");
//     table.text("segments");
//   });
// }

// export async function down(knex: Knex): Promise<void> {
// }
