// import * as Knex from "knex";

// export async function seed(knex: Knex): Promise<void> {
//   await seedContent(knex);
//   await seedAds(knex);
//   await seedVideos(knex);
// }

// async function seedVideos(knex: Knex): Promise<void> {
//   // Deletes ALL existing entries
//   await knex("videos").del();

//   // Inserts seed entries
//   await knex("videos").insert([
//     // content
//     {
//       videoId: "video-1",
//       contentId: "content-1",
//       height: 1080,
//       width: 1920,
//       format: "HLS",
//       status: "pending",
//     },
//     {
//       videoId: "video-2",
//       contentId: "content-1",
//       height: 720,
//       width: 1280,
//       format: "HLS",
//       status: "pending",
//     },
//     {
//       videoId: "video-3",
//       contentId: "content-1",
//       height: 360,
//       width: 640,
//       format: "HLS",
//       status: "pending",
//     },
//     // ads
//     {
//       videoId: "video-4",
//       adId: "ad-1",
//       height: 1080,
//       width: 1920,
//       format: "HLS",
//       status: "pending",
//     },
//     {
//       videoId: "video-5",
//       adId: "ad-1",
//       height: 720,
//       width: 1280,
//       format: "HLS",
//       status: "pending",
//     },
//     {
//       videoId: "video-6",
//       adId: "ad-1",
//       height: 360,
//       width: 640,
//       format: "HLS",
//       status: "pending",
//     },
//   ]);
// }

// async function seedContent(knex: Knex): Promise<void> {
//   // Deletes ALL existing entries
//   await knex("content").del();

//   await knex("content").insert([
//     {
//       contentId: "content-1",
//       title: "Costa XXX",
//       sourceFilePath: "change-me",
//       status: "pending",
//       cuePoints: JSON.stringify([30, 60, 90]),
//     },
//   ]);
// }

// async function seedAds(knex: Knex): Promise<void> {
//   // Deletes ALL existing entries
//   await knex("ads").del();

//   await knex("ads").insert([
//     {
//       adId: "ad-1",
//       title: "Struggling to keep it up?",
//       sourceFilePath: "keep-it-up",
//       status: "pending",
//     },
//   ]);
// }
