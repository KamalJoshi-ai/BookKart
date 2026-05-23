"use client"

import React, { useState } from "react"
import { Address } from "../types/Adrress"
import {
  useAddOrUpdateAddressMutation,
  useGetAddressQuery
} from "@/store/api"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"

import BookLoader from "@/lib/BookLoader"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import { Check, CheckCircle2, Circle, Pencil, Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"



/* ----------------------------- SCHEMA ----------------------------- */

export const addressFormSchema = yup.object({
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required(),

  addressLine1: yup
    .string()
    .min(5, "Address Line 1 at least 5 characters")
    .required(),

  addressLine2: yup
    .string()
    .required("Address Line 2 is required"),

  city: yup
    .string()
    .min(2)
    .required(),

  state: yup
    .string()
    .min(2)
    .required(),

  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required()
})

type AddressFormType = yup.InferType<typeof addressFormSchema>


/* ------------------------- DEFAULT VALUES ------------------------- */

const defaultAddressValues: AddressFormType = {
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: ""
}


/* ----------------------------- TYPES ------------------------------ */

interface CheckoutAddressProps {
  onAddressSelect: (address: Address) => void
  selectedAddressId?: string
}


/* --------------------------- COMPONENT ---------------------------- */

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({
  onAddressSelect,
  selectedAddressId
}) => {

  const { data: addressData , isLoading } = useGetAddressQuery(undefined) 

  const [addOrUpdateAddress, { isLoading: isMutating }] = useAddOrUpdateAddressMutation()

  const [showAddressForm, setShowAddressForm] = useState(false)

  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null)

  const addresses:any = addressData?.data ?? []


  /* --------------------------- FORM SETUP --------------------------- */

  const form = useForm<AddressFormType>({
    resolver: yupResolver(addressFormSchema),
    defaultValues: defaultAddressValues
  })


  /* -------------------------- EDIT ADDRESS -------------------------- */

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)

    form.reset({
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode
    })

    setShowAddressForm(true)


  }


  /* --------------------------- SUBMIT FORM -------------------------- */

  const onSubmit = async (data: AddressFormType) => {

    try {
      let payload

      if (editingAddress) {
        payload = {
          ...editingAddress,
          ...data,
          addressId: editingAddress._id
        }
      } else {
        payload = data
      }

      // Wait for the mutation to complete
      const result = await addOrUpdateAddress(payload).unwrap()

      // Check if the response was successful
      if (result?.success) {
        form.reset(defaultAddressValues)
        setShowAddressForm(false)
        setEditingAddress(null)
      }

    } catch (error) {
      console.error("Error submitting address:", error)
    }

  }


  /* --------------------------- LOADING UI --------------------------- */

  if (isLoading) {
    return <BookLoader />
  }


  /* ----------------------------- RENDER ----------------------------- */

  return (
    <div>

      {/* ---------------------- ADDRESS LIST ---------------------- */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {addresses?.addresses?.map((address: Address) => (

          <Card
            key={address._id}
            className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
              selectedAddressId === address._id
                ? "border-blue-500 shadow-lg"
                : "border-blue-200 shadow-md hover:shadow-lg"
            }`}
          > 

            <CardContent className="p-6 space-y-4">

              <div className="flex items-center justify-between">

           
                <Checkbox
                  checked={selectedAddressId === address._id}
                  onCheckedChange={() => onAddressSelect(address)}
                  className="w-5 h-5"
                /> 

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEditAddress(address)}
                >
                  <Pencil className="h-5 w-5 text-gray-600 hover:text-blue-500" />

                </Button>  

              </div>


              <div className="text-sm text-gray-600">

                <p>{address.addressLine1}</p>


                {address.addressLine2 && (
                  <p>{address.addressLine2}</p>
                )}

                <p>
                  {address.city}, {address.state} {address.pincode}
                </p>

                <p>Phone: {address.phoneNumber}</p>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>


      {/* ----------------------- ADDRESS FORM ----------------------- */}

      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>

        <DialogTrigger asChild>

          <Button className="w-full" variant="outline">

            <Plus className="mr-2 h-4 w-4" />

            Add New Address

          </Button>

        </DialogTrigger>


        <DialogContent className="sm:max-w-106.25">

          <DialogHeader>

            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>

          </DialogHeader>


          <Form {...form}>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >

              {/* Phone */}

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>Phone Number</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter phone number"
                        {...field}
                        disabled={isMutating}
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />


              {/* Address Line 1 */}

              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>Address Line 1</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="House / Street"
                        {...field}
                        disabled={isMutating}
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />


              {/* Address Line 2 */}

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>Address Line 2</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Apartment / Landmark"
                        {...field}
                        disabled={isMutating}
                      />
                    </FormControl>

                  </FormItem>
                )}
              />


              {/* City */}

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>City</FormLabel>

                    <FormControl>
                      <Input 
                        placeholder="City" 
                        {...field}
                        disabled={isMutating}
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />


              {/* State */}

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>State</FormLabel>

                    <FormControl>
                      <Input 
                        placeholder="State" 
                        {...field}
                        disabled={isMutating}
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />


              {/* Pincode */}

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>Pincode</FormLabel>

                    <FormControl>
                      <Input 
                        placeholder="Pincode" 
                        {...field}
                        disabled={isMutating}
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />


              <Button 
                type="submit" 
                className="w-full"
                disabled={isMutating}
              >
                {isMutating ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
              </Button>


            </form>

          </Form>

        </DialogContent>

      </Dialog>

    </div>
  )
}

export default CheckoutAddress