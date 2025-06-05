"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { signin } from "../../../actions/auth";
import Link from "next/link";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signin(username);
      
      if (!result.success) {
        setError(result.msg || "Login failed");
        return;
      }
      
      router.push("/dashboard"); // Redirect on success
    } catch (error) {
      console.error("Login failed:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center  justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-[500px] ">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your username to access your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auth Notice */}
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-800">
              Note: This project uses username-only authentication for demo purposes.
            </AlertDescription>
          </Alert>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className=" text-center w-full">
          <p className="text-red-400 ">Dont have an account?{" "}<Link href={'/sign-up'} className="underline cursor-pointer text-black">SignUp</Link></p> 

          </div>
        </CardContent>
      </Card>
    </div>
  );
}