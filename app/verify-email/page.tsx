"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          await authApi.verifyEmail(token);
          setVerified(true);
          await refresh();
          setTimeout(() => router.push("/dashboard"), 2000);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Verification failed");
        } finally {
          setLoading(false);
        }
      };
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token, refresh, router]);

  const handleResend = async () => {
    if (!email) return;
    try {
      await authApi.resendVerification(email);
      setResendSent(true);
      setTimeout(() => setResendSent(false), 3000);
    } catch {
      setError("Failed to resend verification email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-900">
            ₹ GigLedger
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">Verify your email</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                Verifying your email...
              </AlertDescription>
            </Alert>
          )}
          {verified && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Email verified! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
          {!token && email && (
            <div>
              <p className="text-gray-700 text-center mb-4">
                We sent a verification link to <strong>{email}</strong>. Check
                your inbox and click the link to verify.
              </p>
              {resendSent && (
                <Alert className="border-green-200 bg-green-50 mb-4">
                  <AlertDescription className="text-green-800">
                    Verification email sent! Check your inbox.
                  </AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleResend}
                className="w-full mb-3"
                variant="outline"
              >
                Resend Verification Email
              </Button>
              <Link href="/login">
                <Button className="w-full" variant="ghost">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
