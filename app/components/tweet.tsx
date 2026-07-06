"use client";

import { Tweet } from "react-tweet";

export function TweetComponent({ id }: { id: string }) {
  if (!id) {
    return null;
  }

  return (
    <div className="tweet my-6">
      <div className={`flex justify-center`}>
        <Tweet id={id} />
      </div>
    </div>
  );
}
