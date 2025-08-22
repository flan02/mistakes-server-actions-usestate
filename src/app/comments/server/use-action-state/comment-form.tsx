"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { createComment } from "./actions";

export default function CommentForm() {
  // useActionState is like a combination of useState and useEffect for handling form actions and user mutations
  // Returns a tuple with the current form state, a function to submit the form, and a loading state
  const [state, formAction, pending] = useActionState(createComment, undefined);

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <Input
          name="text"
          defaultValue={state?.text}
          placeholder="Add a comment..."
          className="flex-1"
          required
          maxLength={100}
          disabled={pending}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Posting..." : "Post"}
        </Button>
      </div>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}