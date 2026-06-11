"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/AuthProvider";
import { authApi } from "@/app/_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const isNew = searchParams.get("isNew");
  const router = useRouter();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

   useEffect(() => {
     const handleVerify = async () => {
       setLoading(true);
       setError("");
       try {
         await authApi.verifyEmail(token || "");
         setVerified(true);
         await refresh();
         setTimeout(() => router.push("/dashboard"), 2000);
       } catch (err) {
         setError(err instanceof Error ? err.message : "Verification failed");
       } finally {
         setLoading(false);
       }
     };

     if (token) {
       handleVerify();
     }
   }, [token, refresh, router]);

  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendSent(false);
    try {
      await authApi.resendVerification(email || "");
      setResendSent(true);
      setTimeout(() => setResendSent(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend");
    } finally {
      setResendLoading(false);
    }
  };

  if (token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-900">
              {loading ? "Verifying..." : verified ? "Verified!" : "Verification Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-center text-gray-600">Please wait...</p>}
            {verified && (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
                <p className="text-center text-gray-600">
                  Email verified successfully. Redirecting to dashboard...
                </p>
              </div>
            )}
            {error && (
              <div className="flex gap-3 rounded-md bg-red-50 p-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-900">Verify Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Check your inbox for a verification link sent to{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
            {resendSent && (
              <div className="rounded-md bg-green-50 p-3">
                <p className="text-sm text-green-700">Email sent successfully!</p>
              </div>
            )}
            <Button
              onClick={handleResend}
              disabled={resendLoading}
              variant="outline"
              className="w-full"
            >
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </Button>
            <div className="border-t border-gray-200 pt-4 text-center">
              <Link href="/login" className="text-sm font-medium text-gray-900 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}