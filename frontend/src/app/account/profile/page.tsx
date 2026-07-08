"use client";
import { RootState } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Store, User } from "lucide-react";
import { useUpdateUserMutation, useVerifyAuthQuery } from "@/store/api";
import { setUser } from "@/store/slice/user-slice";
import toast from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useBecomeSellerMutation } from "@/store/api";
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

      const result:any = await updateUser({
        userId: user?._id,
        userData: formData,
      }).unwrap();

      if (result.success && result.data) {
        dispatch(setUser(result?.data));
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        toast.success("Profile updated successfully");
      } else {
        throw new Error("Could not update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const currentAvatar = avatarPreview || user?.profilePicture;
  const [becomeSeller, { isLoading: isBecomingseller }] =
    useBecomeSellerMutation();

  const handleBecomeSeller = async () => {
    try {
      const result = await becomeSeller(undefined).unwrap();
      if (result.success && result.data) {
        dispatch(setUser(result.data));
        toast.success("You are now a seller!");
        router.push("/seller/dashboard");
      }
    } catch (error) {
      toast.error("Failed to become seller");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 sm:p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-pink-100 text-sm sm:text-base">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Avatar + Role Card */}
      <Card className="shadow-lg">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={user?.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-pink-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-pink-500 flex items-center justify-center ring-4 ring-pink-200">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-pink-500 text-white rounded-full p-1.5 shadow-md hover:bg-pink-600 transition"
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

            {/* Name + Badge */}
            <div className="min-w-0 text-center sm:text-left">
              <p className="text-xl font-bold text-gray-800 truncate">
                {user?.name}
              </p>
              <p className="text-gray-500 text-sm truncate max-w-[200px] sm:max-w-xs">
                {user?.email}
              </p>
              <div className="mt-2 flex justify-center sm:justify-start">
                <Badge
                  className={
                    user?.role === "seller" ? "bg-green-500" : "bg-pink-500"
                  }
                >
                  {user?.role === "seller" ? "⭐ Seller" : "👤 Customer"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info Card */}
      <Card className="border-t-4 border-t-pink-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 mt-4">
          <CardTitle className="text-2xl text-pink-700">
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your profile details and contact information
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <form
            onSubmit={handleSubmit(handleProfileEdit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    disabled={!isEditing}
                    className="pl-10"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  disabled={true}
                  value={user?.email || ""}
                  readOnly
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <CardFooter className="bg-pink-50 mt-4 p-5 flex flex-col sm:flex-row gap-3 sm:justify-between">
              {isEditing ? (
                <>
                  <Button
                    className="bg-black/70 cursor-pointer w-full sm:w-auto"
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                      setAvatarPreview(null);
                      setAvatarFile(null);
                    }}
                  >
                    Discard Changes
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white w-full sm:w-auto"
                    variant="outline"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white w-full sm:w-auto"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Become a Seller — sirf customer ko dikhega */}
      {user?.role !== "seller" && (
        <Card className="border-t-4 border-t-green-500 shadow-lg">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Store className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    Become a Seller
                  </p>
                  <p className="text-gray-500 text-sm">
                    Start selling your books on BookKart
                  </p>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-full sm:w-auto">
                    Get Started
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Become a Seller?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to become a seller on BookKart? You
                      will be able to list your books and start earning money.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBecomeSeller}
                      disabled={isBecomingseller}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {isBecomingseller
                        ? "Processing..."
                        : "Yes, Become a Seller!"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seller Dashboard — sirf seller ko dikhega */}
      {user?.role === "seller" && (
        <Card className="border-t-4 border-t-green-500 shadow-lg">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Store className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    Seller Dashboard
                  </p>
                  <p className="text-gray-500 text-sm">
                    Manage your listings, orders and earnings
                  </p>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-full sm:w-auto"
                onClick={() => router.push("/seller/dashboard")}
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
