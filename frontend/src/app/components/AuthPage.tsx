"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import  Image  from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import {
  useForgotPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/api";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  authStatus,
  setUser,
  toggleLoginDialog,
} from "@/store/slice/user-slice";
import { loginSchema,signupSchema,forgotSchema } from "../validations/auth.validation";
// ----------------------------
// VALIDATION
// ----------------------------


interface LoginProps {
  isLoginOpen: boolean;
  setIsLoginOpen: () => void;
}

export default function AuthPage({ isLoginOpen, setIsLoginOpen }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState("login");

  const dispatch = useDispatch();
  const router = useRouter();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [login, { isLoading: isLogingLoading }] = useLoginMutation();
  const [forgotPassword, { isLoading: isForgotPasswdLoading }] = useForgotPasswordMutation();

  const loginForm = useForm({ resolver: yupResolver(loginSchema) ,defaultValues: {
    email: "",
    password: ""
  } });
  const signupForm = useForm({ resolver: yupResolver(signupSchema) ,defaultValues: {
    name: "",
    email: "",
    password: "",
    isSeller: false
  }});
  const forgotForm = useForm({ resolver: yupResolver(forgotSchema),defaultValues: {
    email: ""
  } });

  // ----------------------------
  // SIGNUP SUBMIT
  // ----------------------------
  const onSubmitSignUp = async (data: any) => {
    try {
      const res = await register(data).unwrap();

      if (res.success) {
        toast.success("Verification link sent!");
        dispatch(toggleLoginDialog());
      signupForm.reset();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  // ----------------------------
  // LOGIN SUBMIT
  // ----------------------------
  const onSubmitLogin = async (data: any) => {
    try {
      const res = await login(data).unwrap();
      if (res.success) {
        toast.success("Logged in successfully!");
        dispatch(toggleLoginDialog());
        dispatch(authStatus());
          if (res.data.user.role === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
        
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid credentials");
      
    }
  };

  const handleGoogleLogin = async () => {
  try {
       toast.success("Redirecting to Google login...");

    window.location.href = "https://bookstore-backend-5k3s.onrender.com/api/auth/google";
   
      // dispatch(authStatus());
  } catch (error) {
    toast.error("Google login failed");
  }
};
  // ----------------------------
  // FORGOT PASSWORD SUBMIT
  // ----------------------------
  const onSubmitForgot = async (data: any) => {
    try {
      const res = await forgotPassword(data).unwrap();
      if (res.success) {
        toast.success("Reset link sent!");
      }
    } catch (err) {
      toast.error("Error sending reset link");
    }
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="sm:max-w-[450px] p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to Book Kart
          </DialogTitle>

          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="mt-3"
          >
            <TabsList className="grid grid-cols-3 w-full mb-5">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="forgot">Forgot</TabsTrigger>
            </TabsList>

            {/* ------------------------- LOGIN ------------------------- */}
            <TabsContent value="login">
              <form
                onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                className="space-y-3"
              >
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Image
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  Continue with Google
                </Button>

                <div className="text-center text-gray-500 text-sm">or</div>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Email"
                    className="pl-10"
                    {...loginForm.register("email")}
                  />
                </div>
  <p className="text-red-500 text-sm">
                {loginForm.formState.errors.email?.message}
              </p>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="pl-10"
                    {...loginForm.register("password")}
                  />
                </div>
  <p className="text-red-500 text-sm">
                {loginForm.formState.errors.password?.message}
              </p>
                <div className="text-right">
                  <button
                    type="button"
                    className="text-blue-600 text-sm"
                    onClick={() => setCurrentTab("forgot")}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button className="w-full" disabled={isLogingLoading}>
                  {isLogingLoading ? "Logging in..." : "Login"}
                </Button>
              </form>


            

            
            </TabsContent>

            {/* ------------------------- SIGNUP ------------------------- */}
            <TabsContent value="signup">
              <form
                onSubmit={signupForm.handleSubmit(onSubmitSignUp)}
                className="space-y-3"
              >
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Full Name"
                    className="pl-10"
                    {...signupForm.register("name")}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Email"
                    className="pl-10"
                    {...signupForm.register("email")}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...signupForm.register("password")}
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

 <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
      <input
        type="checkbox"
        className="w-4 h-4 accent-blue-600"
        {...signupForm.register("isSeller")}
      />
      <div>
        <p className="text-sm font-medium text-gray-800">Register as Seller</p>
        <p className="text-xs text-gray-500">List your old books and start earning</p>
      </div>
    </label>
                <Button className="w-full" disabled={isRegisterLoading}>
                  {isRegisterLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
              <p className="text-red-500 text-sm">
                {signupForm.formState.errors.name?.message}
              </p>

              <p className="text-red-500 text-sm">
                {signupForm.formState.errors.email?.message}
              </p>

              <p className="text-red-500 text-sm">
                {signupForm.formState.errors.password?.message}
              </p>
            </TabsContent>

            {/* ------------------------- FORGOT ------------------------- */}
            <TabsContent value="forgot">
              <form
                onSubmit={forgotForm.handleSubmit(onSubmitForgot)}
                className="space-y-3"
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter your email"
                    className="pl-10"
                    {...forgotForm.register("email")}
                  />
                </div>

                <Button className="w-full" disabled={isForgotPasswdLoading}>
                  {isForgotPasswdLoading
                    ? "Sending link..."
                    : "Send Reset Link"}
                </Button>

                <button
                  type="button"
                  className="text-blue-600 text-sm mx-auto block"
                  onClick={() => setCurrentTab("login")}
                >
                  Back to Login
                </button>
              </form>
              <p className="text-red-500 text-sm">
                {forgotForm.formState.errors.email?.message}
              </p>
            </TabsContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
