"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useVerifyEmailMutation } from "@/store/api";
import { useDispatch } from "react-redux";
import { setEmailVerified } from "@/store/slice/user-slice";

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
const dispatch = useDispatch();
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    if (!token) {
        
      toast.error("No token provided");
      router.push("/");
      return;
    }
   
    verifyEmailToken();
  }, [token]);

  const verifyEmailToken = async () => {
    try {
     
  const res=  await verifyEmail(token).unwrap();
  console.log(res)
      toast.success("Email verified successfully!");
      dispatch(setEmailVerified(true))
       if (res.data.user.role === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
     
    } catch (err: any) {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Verifying...</h1>
        <p className="text-gray-600">Please wait while we verify your email.</p>
      </div>
    </div>
  );
}