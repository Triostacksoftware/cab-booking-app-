type ScreenState = | "AUTH" | "HOME" | "RIDE_REQUEST" | "OTP_VERIFY" | "ACTIVE_RIDE" | "PROFILE";

type User = {
    fullName:String,
    mobileNumber:String,
    city:String,
    vehicleCapacity: String,
    vehicleNumber:String
}

export {ScreenState, User};