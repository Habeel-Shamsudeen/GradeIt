"use client";
import { absoluteUrl } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { signIn } from "next-auth/react";

export default function AuthWrapper() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <div className="w-full max-w-full sm:max-w-[400px] p-0 sm:p-4">
          <>
            <div className="space-y-4 mt-4 md:mt-0">
              <Button
                variant="reverse"
                className="w-full border border-gray-300 bg-white text-black hover:bg-gray-100"
                onClick={async () => {
                  try {
                    setIsGoogleLoading(true);
                    await signIn("google");
                  } catch (error) {
                    // Handle error if needed
                    console.log(error);
                  } finally {
                    setIsGoogleLoading(false);
                  }
                }}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="mr-2 h-5 w-5"
                  >
                    <title id="svg">Google</title>
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>
            </div>
            <Separator className="mt-6 mb-4" />
            <div className="mt-3 flex justify-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <a
                  href={`${absoluteUrl("/privacy")}`}
                  target="_blank"
                  className="underline"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href={`${absoluteUrl("/terms")}`}
                  target="_blank"
                  className="underline"
                  rel="noreferrer"
                >
                  T&amp;Cs
                </a>
              </p>
            </div>
          </>
        </div>
      </div>
    </>
  );
}
