"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Camera, Store, User, ShieldCheck, Mail, Phone, Edit2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUpdateUserMutation, useBecomeSellerMutation } from "@/store/api";
import { setUser } from "@/store/slice/user-slice";
import { RootState } from "@/store/store";
import toast from "react-hot-toast";

const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
});

type UserData = {
  name: string;
  email?: string;
  phoneNumber: string;
};

export default function Page() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [becomeSeller, { isLoading: isBecomingseller }] = useBecomeSellerMutation();

  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    });
  }, [user, isEditing, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileEdit = async (data: UserData) => {
    const { name, phoneNumber } = data;
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phoneNumber", phoneNumber);
      if (avatarFile) formData.append("profilePicture", avatarFile);

      const result: any = await updateUser({
        userId: user?._id,
        userData: formData,
      }).unwrap();

      if (result.success && result.data) {
        dispatch(setUser(result.data));
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        toast.success("Profile updated successfully");
      } else {
        throw new Error("Could not update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleBecomeSeller = async () => {
    try {
      const result = await becomeSeller(undefined).unwrap();
      if (result.success && result.data) {
        dispatch(setUser(result.data));
        toast.success("You are now a seller!");
        router.push("/seller/dashboard");
      }
    } catch {
      toast.error("Failed to become seller");
    }
  };

  const currentAvatar = avatarPreview || user?.profilePicture;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Personal Profile</h1>
          <p className="text-xs text-gray-500 mt-1">Manage your account credentials, phone number, and seller role status</p>
        </div>

        <Badge className={user?.role === "seller" ? "bg-emerald-600 text-white font-bold text-xs px-3 py-1" : "bg-[#2874f0] text-white font-bold text-xs px-3 py-1"}>
          {user?.role === "seller" ? "⭐ Verified Seller" : "👤 Customer Account"}
        </Badge>
      </div>

      {/* Profile Details Card */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            
            {/* Avatar Stage */}
            <div className="relative shrink-0">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={user?.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#2874f0] shadow-xs"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#2874f0] text-white font-black text-3xl flex items-center justify-center shadow-xs">
                  {initial}
                </div>
              )}

              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-md hover:bg-blue-700 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Name Meta */}
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(handleProfileEdit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-gray-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    disabled={!isEditing}
                    placeholder="Your Full Name"
                    className="pl-9 text-xs"
                    {...register("name")}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    disabled={true}
                    value={user?.email || ""}
                    className="pl-9 text-xs bg-gray-50 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber" className="text-xs font-bold text-gray-700">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    disabled={!isEditing}
                    placeholder="10-digit mobile number"
                    className="pl-9 text-xs"
                    {...register("phoneNumber")}
                  />
                </div>
                {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
              </div>

            </div>

            <CardFooter className="px-0 pt-4 border-t border-gray-100 flex justify-end gap-3">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                      setAvatarPreview(null);
                      setAvatarFile(null);
                    }}
                    className="text-xs font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                </Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Become a Seller Section */}
      {user?.role !== "seller" && (
        <Card className="bg-white border border-gray-200 rounded-xl shadow-xs p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">Start Selling Old Books</h3>
                <p className="text-xs text-gray-500">Earn money by listing your secondhand books on BookKart marketplace.</p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-[#ffe500] hover:bg-yellow-400 text-gray-900 font-bold text-xs px-6 py-2.5">
                  Become a Seller
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white border border-gray-200">
                <AlertDialogHeader>
                  <AlertDialogTitle>Become a Seller on BookKart?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Confirm to upgrade your account to Seller status. You will get access to your Seller Dashboard to list books and earn money.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleBecomeSeller}
                    disabled={isBecomingseller}
                    className="bg-[#2874f0] hover:bg-blue-700 text-white"
                  >
                    {isBecomingseller ? "Upgrading..." : "Yes, Upgrade Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      )}

      {/* Seller Dashboard Quick Link */}
      {user?.role === "seller" && (
        <Card className="bg-white border border-gray-200 rounded-xl shadow-xs p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center shrink-0 border border-blue-100">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">Seller Dashboard Active</h3>
                <p className="text-xs text-gray-500">Manage your active book listings, customer orders, and payouts.</p>
              </div>
            </div>
            <Button
              className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5"
              onClick={() => router.push("/seller/dashboard")}
            >
              Go to Seller Dashboard
            </Button>
          </div>
        </Card>
      )}

    </div>
  );
}
