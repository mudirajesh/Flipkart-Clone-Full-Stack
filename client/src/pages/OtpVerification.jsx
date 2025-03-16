import React, { useState, useRef, useEffect } from "react"
import toast from "react-hot-toast"
import { FaEyeSlash } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
import SummaryApi from "../common/SummaryApi"
import Axios from "../utils/Axios"
import AxiosToastError from "../utils/AxiosToastError"
import { Link, useLocation, useNavigate } from "react-router-dom"

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""])

  const navigate = useNavigate()
  const inputRef = useRef([])
  const location = useLocation()

  console.log("location", location)

  //when email-id is not available when user redirect to forgot password section
  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password")
    }
  }, [])

  const valideValue = data.every((el) => el)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verification,
        data: {
          otp: data.join(""),
          email: location?.state?.email,
        },
      })

      if (response.data.error) {
        toast.error(response.data.message)
        return
      }

      //whole data send to reset-password page when checking with
      // const location = useLocation()
      // console.log("location", location)
      if (response.data.success) {
        toast.success(response.data.message)
        setData(["", "", "", "", "", ""])
        //otp verification successs it redirect to reset-password page
        navigate("/reset-password", {
          state: {
            data: response.data,
            email: location?.state?.email,
          },
        })
      }
    } catch (error) {
      console.log("error", error)
      AxiosToastError(error)
    }
  }

  return (
    <section className=" w-full container mx-auto p-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg"> Enter OTP </p>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1 ">
            <label htmlFor="email">Enter your OTP :</label>
            <div className="flex items-center gap-2 justify-between mt-4">
              {data.map((element, index) => {
                return (
                  <input
                    key={"otp" + index}
                    type="text"
                    id="otp"
                    ref={(ref) => {
                      inputRef.current[index] = ref
                      return ref
                    }}
                    value={data[index]}
                    maxLength={1}
                    onChange={(e) => {
                      const value = e.target.value
                      const newData = [...data]
                      newData[index] = value
                      setData(newData)

                      if (value && index < 5) {
                        inputRef.current[index + 1].focus()
                      }
                    }}
                    className="bg-blue-50 w-full max-w-16 p-2 border rounded outline:none focus:border-[#ffbf00]
                    text-center font-semibold"
                  />
                )
              })}
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={`${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            }
                  py-2 text-white rounded font-semibold
            my-3 tracking-wide`}
          >
            {" "}
            Verify OTP{" "}
          </button>
        </form>

        <p>
          Already have account ?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-700
          hover:text-green-800"
          >
            Login{" "}
          </Link>
        </p>
      </div>
    </section>
  )
}

export default OtpVerification
