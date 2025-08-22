"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { delay } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { createCommentSchema, CreateCommentValues } from "../../schema";

// ! Mistake 2: Not validating the user input server-side
// $ We must protect our server endpoints


export async function createComment(input: CreateCommentValues): Promise<{ error: string } | undefined> { // ! Mistake 4: Not returning errors correctly
  // $ Define a type for the response either { error: string } or undefined

  try {
    // * Artificial delay to pretend we're connecting to the DB
    await delay(700);

    // ! Mistake 3: Not authenticating the user server-side
    // $ We mustn't authenticate the user on the client-side. Do it on the server-side instead.
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw Error("Unauthorized"); // ? UNEXPECTED ERROR
    }

    // $ We validate the max length of our incoming input either it comes from the client or inyected using postman
    const { text } = createCommentSchema.parse(input);

    if (text.includes("puto")) {
      // throw Error("No profanity allowed"); // ? This will generate an error in production.
      return { error: "No profanity allowed" }; // ? EXPECTED ERROR
    }

    await db.createComment({ text, user: currentUser });

    revalidatePath("/comments/server/client-side-action");
  } catch (error) {
    console.error(error);
    return { error: "Failed to create comment" };
  }
}

// TODO: Code before
/* 

"use server";

import { User } from "@/lib/auth";
import { db } from "@/lib/db";
import { delay } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createComment(text: string, user: User) {

  await delay(700);
  await db.createComment({
    text,
    user,
  });

  revalidatePath("/comments/server/client-side-action");
}

*/