import Link from "next/link";
import React from "react";

export default function Error() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <h1 className="text-2xl mb-4">Oops! Something went wrong.</h1>
        <p className="mb-8">
          There seems to be an issue with our servers processing your
          information. Please try again later.
        </p>
        <Link href="/" legacyBehavior>
          <a className="px-8 py-4">Try Again</a>
        </Link>
      </div>
    </div>
  );
}
