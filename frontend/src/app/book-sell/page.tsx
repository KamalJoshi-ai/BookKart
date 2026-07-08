"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddProductsMutation, useGetProductByIdQuery,useUpdateProductMutation } from "@/store/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { sellBookValidationSchema } from "./validationSchema";
import toast from "react-hot-toast";
import { Banknote, Book, Check, CreditCard, DollarSign, Image, QrCode, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = ["Reading Books", "Academic", "Self-Help", "Biography", "Other"];
const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];
const CLASS_TYPES = ["B.Com", "B.A", "B.Sc", "B.Tech", "M.Com", "Other"];
const SUBJECTS = ["Fiction", "Math", "Science", "History", "Economics", "Other"];

function Input({ label, name, type = "text", placeholder, error, required = false, register, step }: {
  label: string; name: string; type?: string; placeholder?: string;
  error?: any; required?: boolean; register: any; step?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type} placeholder={placeholder} step={step} {...register(name)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${error ? "border-red-500 bg-red-50" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

function Select({ label, name, options, error, required = false, register }: {
  label: string; name: string; options: string[]; error?: any; required?: boolean; register: any;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${error ? "border-red-500 bg-red-50" : "border-gray-300"}`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

export default function SellBookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;
const [updateProduct] = useUpdateProductMutation();
  const user = useSelector((state: RootState) => state.user.user);
  const [addProduct, { isLoading }] = useAddProductsMutation();
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]); // sirf naye files
  const [imagePreview, setImagePreview] = useState<string[]>([]); // existing URLs + blob URLs

  const { data: productData } = useGetProductByIdQuery(editId!, { skip: !editId });
  
  const product = productData?.data;

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    resolver: yupResolver(sellBookValidationSchema),
    mode: "onBlur",
    defaultValues: {
      title: "", author: "", edition: "", description: "",
      category: "", classType: "", subject: "", condition: "",
      price: undefined, finalPrice: undefined, shippingCharge: undefined,
      paymentMode: "UPI", upiId: "", accountNumber: "", ifscCode: "", bankName: "",quantity:1,
    },
  });

  // Edit mode mein form + images pre-fill karo
  useEffect(() => {
    if (product && isEditMode) {
      reset({
        title: product.title,
        author: product.author,
        edition: product.edition ?? "",
        description: product.description ?? "",
        category: product.category,
        classType: product.classType,
        subject: product.subject,
        condition: product.condition,
        price: product.price,
        finalPrice: product.finalPrice,
        shippingCharge: product.shippingCharge,
        paymentMode: product.paymentMode,
        upiId: product.paymentDetails?.upiId ?? "",
        accountNumber: product.paymentDetails?.bankDetails?.accountNumber ?? "",
        ifscCode: product.paymentDetails?.bankDetails?.ifscCode ?? "",
        bankName: product.paymentDetails?.bankDetails?.bankName ?? "",
          quantity: product.quantity ?? 1,
      });
      // existing images seedha imagePreview mein
      setImagePreview(product.images ?? []);
    }
  }, [product, isEditMode, reset]);

  const paymentMode = watch("paymentMode");
  const finalPrice = watch("finalPrice");
  const shippingCharge = watch("shippingCharge");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (imagePreview.length + files.length > 6) {
      alert("Maximum 6 images allowed");
      return;
    }

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) { alert(`File ${file.name} exceeds 5MB limit`); return; }
      if (!file.type.startsWith("image/")) { alert(`File ${file.name} is not a valid image`); return; }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setImages(prev => [...prev, ...newFiles]);
    setImagePreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const preview = imagePreview[index];

    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
      // images array mein bhi hatao — blob ka index nikalo
      const blobIndex = imagePreview.slice(0, index).filter(p => p.startsWith("blob:")).length;
      setImages(prev => prev.filter((_, i) => i !== blobIndex));
    }

    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
   
    if (imagePreview.length === 0) { toast.error("Please upload at least one image"); return; }
    if (!user?._id) { toast.error("User not authenticated"); return; }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("subject", data.subject);
      formData.append("category", data.category);
      formData.append("classType", data.classType);
      formData.append("condition", data.condition);
      formData.append("author", data.author);
      formData.append("edition", data.edition);
      formData.append("price", String(Number(data.price)));
      formData.append("finalPrice", String(Number(data.finalPrice)));
      formData.append("shippingCharge", String(Number(data.shippingCharge)));
      formData.append("paymentMode", data.paymentMode);
      formData.append("quantity", String(Number(data.quantity)));
      const paymentDetails = data.paymentMode === "UPI"
        ? { upiId: data.upiId }
        : { bankDetails: { accountNumber: data.accountNumber, ifscCode: data.ifscCode, bankName: data.bankName } };
      formData.append("paymentDetails", JSON.stringify(paymentDetails));

      // existing images — blob nahi hain
      const existingUrls = imagePreview.filter(p => !p.startsWith("blob:"));
      formData.append("existingImages", JSON.stringify(existingUrls));

      // naye images
      images.forEach(file => formData.append("images", file));


     if (isEditMode) {
  await updateProduct({ productId: editId, formData }).unwrap();
  toast.success("Book updated successfully!");
  router.push("/seller/listings");
} else {
        await addProduct(formData).unwrap();
        toast.success("Book listed successfully!");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        reset();
        setImages([]);
        setImagePreview([]);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(isEditMode ? "Failed to update book" : "Failed to list book");
    }
  };

  if (user?.role !== "seller") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Seller Account Required</h1>
        <p className="text-gray-500">Please upgrade your account to a seller account to list books for sale</p>
        <button onClick={() => router.push("/account/profile")} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
          Become a Seller First
        </button>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {isEditMode ? "Edit Your Book" : "Sell Your Book"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? "Update your book listing" : "Share your book and earn money"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-8 space-y-8">

          {/* Book Information */}
          <div>
            <h2 className="text-xl flex gap-1 font-bold text-gray-900 mb-4"><Book /> Book Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input label="Title" name="title" register={register} error={errors.title} required />
              <Input label="Author" name="author" register={register} error={errors.author} required />
              <Input label="Edition" name="edition" register={register} error={errors.edition} />
              <Select label="Category" name="category" options={CATEGORIES} register={register} error={errors.category} required />
              <Select label="Class Type" name="classType" options={CLASS_TYPES} register={register} error={errors.classType} required />
              <Select label="Subject" name="subject" options={SUBJECTS} register={register} error={errors.subject} required />
              <Select label="Condition" name="condition" options={CONDITIONS} register={register} error={errors.condition} required />
            <Input 
  label="Quantity" 
  name="quantity" 
  type="number" 
  register={register} 
  error={errors.quantity} 
  required 
/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register("description")} rows={4}
                placeholder="Describe the book, its condition, highlights, etc."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${errors.description ? "border-red-500 bg-red-50" : "border-gray-300"}`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex gap-1"><DollarSign /> Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input label="Original Price (₹)" name="price" type="number" register={register} error={errors.price} required step="0.01" />
              <Input label="Selling Price (₹)" name="finalPrice" type="number" register={register} error={errors.finalPrice} required step="0.01" />
              <Input label="Shipping Charge (₹)" name="shippingCharge" type="number" register={register} error={errors.shippingCharge} required step="0.01" />
            </div>
            {finalPrice && shippingCharge && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Selling Price:</span>
                    <span className="text-gray-900 font-medium">₹{Number(finalPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Charge:</span>
                    <span className="text-gray-900 font-medium">₹{Number(shippingCharge).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-blue-200 my-2"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Total Amount:</span>
                    <span className="text-blue-600 font-bold text-lg">₹{(Number(finalPrice) + Number(shippingCharge)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl flex gap-1 font-bold text-gray-900 mb-4">
              <Image /> Images ({imagePreview.length}/6)
            </h2>

            {imagePreview.length > 0 && (
              <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imagePreview.map((src, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden bg-gray-100">
                    <img src={src} alt="preview" className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button" onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <span className="text-white text-2xl">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {imagePreview.length < 6 && (
              <label className="block border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-8 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-blue-50">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl"><Upload /></span>
                  <p className="text-gray-700 font-medium">Click to upload images</p>
                  <p className="text-gray-500 text-sm">PNG, JPG, GIF (Max 5MB per image, up to 6 images)</p>
                </div>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-xl flex gap-2 font-bold text-gray-900 mb-4"><CreditCard /> Payment Details</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method <span className="text-red-500">*</span></label>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="radio" value="UPI" {...register("paymentMode")} className="w-5 h-5" />
                  <span className="ml-3 text-gray-700 font-medium">UPI</span>
                  <span className="ml-2 text-xs text-gray-500">(Recommended)</span>
                </label>
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="radio" value="Bank Account" {...register("paymentMode")} className="w-5 h-5" />
                  <span className="ml-3 text-gray-700 font-medium">Bank Account</span>
                </label>
              </div>
            </div>
            {paymentMode === "UPI" && (
              <div className="space-y-4 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex gap-3">
                  <span className="text-2xl"><QrCode /></span>
                  <div>
                    <h3 className="font-semibold text-gray-900">UPI Payment</h3>
                    <p className="text-sm text-gray-600">Money transfers instantly to your UPI ID</p>
                  </div>
                </div>
                <Input label="UPI ID" name="upiId" register={register} error={errors.upiId} required placeholder="yourname@upi" />
              </div>
            )}
            {paymentMode === "Bank Account" && (
              <div className="space-y-4 p-6 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex gap-3">
                  <span className="text-2xl"><Banknote /></span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Bank Transfer</h3>
                    <p className="text-sm text-gray-600">Direct transfer to your bank account</p>
                  </div>
                </div>
                <Input label="Account Number" name="accountNumber" register={register} error={errors.accountNumber} required placeholder="1234567890" />
                <Input label="IFSC Code" name="ifscCode" register={register} error={errors.ifscCode} required placeholder="SBIN0001234" />
                <Input label="Bank Name" name="bankName" register={register} error={errors.bankName} required placeholder="State Bank of India" />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="submit" disabled={isLoading}
              className="flex-1 bg-blue-600 cursor-pointer text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
              {isLoading ? "⏳ Saving..." : isEditMode ? " Update Listing" : " Publish Listing"}
            </button>
            {!isEditMode && (
              <button type="reset" onClick={() => { reset(); setImages([]); setImagePreview([]); }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">
                Reset
              </button>
            )}
          </div>
        </form>

        {success && (
          <div className="mt-4 flex gap-1 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <Check /> Book listed successfully!
          </div>
        )}
      </div>
    </div>
  );
}