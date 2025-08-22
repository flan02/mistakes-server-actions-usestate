"use server";

import { getCurrentUser } from "@/lib/auth";
import { Comment } from "@/lib/data";
import { db } from "@/lib/db";
import { delay } from "@/lib/utils";
import { createCommentSchema, CreateCommentValues } from "../schema";


type ActionResult =
  | { data: Comment; error?: undefined }
  | { data?: undefined; error: string };

export async function createComment(input: CreateCommentValues): Promise<ActionResult> {
  try {
    // Artificial delay to pretend we're connecting to the database
    await delay(4000);

    const { text } = createCommentSchema.parse(input);

    if (text.includes("Java")) {
      return { error: "No profanity allowed" };
    }

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const newComment = await db.createComment({
      text,
      user: currentUser,
    });

    return { data: newComment };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create comment" };
  }
}


// ! Mistake 5: Using server actions to fetch data
// ? We mustn't use server actions to fetch data directly. Use an API route handler instead.

// export async function getComments(cursor?: number) {
//   const pageSize = 5
//   await delay(4000)

// Below is identical to how I do pagination with Prisma ORM
//   const comments = await db.findComments({
//     take: pageSize + 1,
//     cursor: cursor ? { id: cursor } : undefined,
//     sort: "desc"
//   })

//   const nextCursor = comments.length > pageSize ? comments[pageSize].id : undefined;

//   return {
//     comments: comments.slice(0, pageSize),
//     nextCursor
//   };
// }