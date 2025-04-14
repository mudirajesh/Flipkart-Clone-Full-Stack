import UserModel from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js"
import generatedAccessToken from "../utils/generatedAccessToken.js"
import generatedRefreshToken from "../utils/generatedRefreshToken.js"
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js"
import generatedOtp from "../utils/generatedOtp.js"
import sendEmail from "../config/sendEmail.js"
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js"
import jwt from "jsonwebtoken"

export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Provide email,name and password",
        error: true,
        success: false,
      })
    }

    const user = await UserModel.findOne({
      email,
    })

    if (user) {
      return response.json({
        message: "Already register email id",
        error: true,
        success: false,
      })
    }

    //password salting
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    //store user and passowrd in database
    const payload = {
      name,
      email,
      password: hashedPassword,
    }

    //savedn in mongodatabase
    const newUser = new UserModel(payload)
    const save = await newUser.save()

    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

    //verify email
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from flipkart",
      html: verifyEmailTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    })

    return response.json({
      message: "User register successfully",
      error: false,
      success: true,
      data: save,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

export async function verifyEmailController(request, response) {
  try {
    const { code } = request.body

    const user = await UserModel.findOne({ _id: code })

    if (!user) {
      return response.status(400).json({
        message: "Invalid code",
        error: true,
        success: false,
      })
    }

    const updateUser = await UserModel.updateOne(
      {
        _id: code,
      },
      { verify_email: true }
    )

    return response.json({
      message: "Email verification Done",
      success: true,
      error: false,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

//login controller
export async function loginController(request, response) {
  try {
    const { email, password } = request.body

    if (!email || !password) {
      return response.status(400).json({
        message: "Email and password are required",
        error: true,
        success: false,
      })
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
      return response.status(400).json({
        message: " User not register ",
        error: true,
        success: false,
      })
    }

    if (user.status !== "Active") {
      return response.status(400).json({
        message: " Contact to Admin",
        error: true,
        success: false,
      })
    }

    const checkPassword = await bcryptjs.compare(password, user.password)

    if (!checkPassword) {
      return response.status(400).json({
        message: "Check your password",
        error: true,
        success: false,
      })
    }

    const accesstoken = await generatedAccessToken(user._id)
    const refreshToken = await generatedRefreshToken(user._id)

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      last_login_data: new Date(),
    })

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    }

    response.cookie("accessToken", accesstoken, cookiesOption)
    response.cookie("refreshToken", refreshToken, cookiesOption)

    return response.json({
      message: "Login Successfully",
      error: false,
      success: true,
      data: {
        accesstoken,
        refreshToken,
      },
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

//logout controller
export async function logoutController(request, response) {
  try {
    const userid = request.userId //middleware
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    }

    response.clearCookie("accessToken", cookiesOption)
    response.clearCookie("refreshToken", cookiesOption)

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    })

    return response.json({
      message: "Logout Successfully",
      error: false,
      success: true,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

//upload user avatar
export async function uploadAvatar(request, response) {
  try {
    const userId = request.userId //auth middleware
    const image = request.file //multer middleware

    const upload = await uploadImageCloudinary(image)

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    })

    return response.json({
      message: "Upload profile",
      success: true,
      error: false,
      data: {
        _id: userId,
        avatar: upload.url,
      },
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

// update user details
export async function updateUserDetails(request, response) {
  try {
    const userId = request.userId //auth middleware

    const { name, email, password, mobile } = request.body

    let hashPassword = ""

    if (password) {
      const salt = await bcryptjs.genSalt(10)
      hashPassword = await bcryptjs.hash(password, salt)
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      }
    )

    return response.json({
      message: "Updated successfully",
      error: false,
      success: true,
      data: updateUser,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

//forgot password
export async function forgotPasswordController(request, response) {
  try {
    const { email } = request.body

    const user = await UserModel.findOne({
      email,
    })

    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      })
    }

    const otp = generatedOtp()
    const expiryTime = new Date() + 60 * 60 * 1000 //1 hr

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password: otp,
      forgot_pasword_expiry: new Date(expireTime).toISOString(),
    })

    await sendEmail({
      sendTo: email,
      subject: "Forgot password from Flipkart",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }), //utils
    })

    return response.json({
      message: "check your email",
      error: false,
      success: true,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

//verify forgot password
export async function verifyForgotPasswordOtp(request, response) {
  try {
    const { email, otp } = request.body

    if (!email || !otp) {
      return response.status(400).json({
        message: "Provide required field email, otp",
        error: true,
        success: false,
      })
    }

    const user = await UserModel.findOne({
      email,
    })

    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      })
    }

    const currentTime = new Date().toISOString()

    if (user.forgot_password_expiry < currentTime) {
      return response.status(400).json({
        message: "Otp is expired",
        error: true,
        success: false,
      })
    }

    if (otp !== user.forgot_password_otp) {
      return response.status(400).json({
        message: "Invalid otp",
        error: true,
        success: false,
      })
    }

    //if otp is expired
    //otp  ===  user.forgot_password_otp

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      forgot_password_otp: "",
      forgot_password_expiry: "",
    })

    return response.json({
      message: "Verify otp Successfully",
      error: false,
      success: true,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

//reset the password
export async function resetpassword(request, response) {
  try {
    const { email, newPassword, confirmPassword } = request.body

    if (!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        messsage: "Provide required fields email, newPassword, confirmPassword",
      })
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
      return response.status(400).json({
        message: "Email is not available",
        error: true,
        success: false,
      })
    }

    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "newPassword and confirmPassword must be same",
        error: true,
        success: false,
      })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(newPassword, salt)

    const update = await UserModel.findOneAndUpdate(user.id, {
      password: hashPassword,
    })

    //send to acknowledgement to client
    return response.json({
      message: "Password updated Successfully ",
      error: false,
      success: true,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

//refresh token controller
export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookies.refreshToken ||
      request?.headers?.authorization?.split("")[1] // [Bearer token]

    if (!refreshToken) {
      return response.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      })
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    )

    if (!verifyToken) {
      return response.status(401).json({
        message: "token in expired",
        error: true,
        success: false,
      })
    }

    const userId = verifyToken?._id

    const newAccessToken = await generatedAccessToken(userId)

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    }

    response.cookie("accessToken", newAccessToken, cookiesOption)

    return response.json({
      message: "New Access Token generated",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

//get login user details
export async function userDetails(request, response) {
  try {
    //id came from middleware
    const userId = request.userId

    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    )

    return response.json({
      message: "user details",
      data: user,
      error: false,
      success: true,
    })
  } catch (error) {
    return response.status(500).json({
      message: "Something is wrong",
      error: true,
      success: false,
    })
  }
}
