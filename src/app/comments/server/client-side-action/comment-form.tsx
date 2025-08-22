"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { createComment } from "./actions";

// ! Mistake 1: Not wrapping client-side server actions calls into transitions (useTransition, revalidatePath)
// ? https://react.dev/reference/react/useActionState



export default function CommentForm() {
  const [input, setInput] = useState("");
  // $ Using useTransition to allow the UI to remain responsive while the action is being processed
  const [isPending, startTransition] = useTransition(); // ? change usestate to usetransition
  const [error, setError] = useState<string | null>(null);


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await createComment({ text: input });
      if (response?.error) {
        setError(response.error);
        return;
      }
      startTransition(() => {
        setInput("");
      });
    });
    // React19 recommends using nested startTransition. We don't need to manage try-catch-finally anymore.
  }

  // ? Example of nested startTransition by react19 docs.
  // startTransition(() => {
  //   const data = await updateData(name);
  //   startTransition(() => {
  //     setData(data);
  //   })
  // });

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
          maxLength={100}
          disabled={isPending}
        />
        <Button type="submit" disabled={!input.trim() || isPending}>
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

// TODO: Code before
/* 
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/lib/auth";
import { useState } from "react";
import { createComment } from "./actions";

export default function CommentForm() {
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      setIsPending(true);
      await createComment(input, user);
      setInput("");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
          maxLength={100}
          disabled={isPending}
        />
        <Button type="submit" disabled={!input.trim() || isPending}>
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

*/