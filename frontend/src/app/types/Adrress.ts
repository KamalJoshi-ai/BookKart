import { StringSchema } from "yup"

export interface Address {
    _id:string
    addressLine1:string
    addressLine2?:string
    phoneNumber:string
    city:string
    state:string
    pincode:string
}