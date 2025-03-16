import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import AxiosToastError from "../utils/AxiosToastError"
import Axios from "../utils/Axios"
import toast from "react-hot-toast"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import SummaryApi from "../common/SummaryApi"

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const valideValue = Object.values(data).every((el) => el)

  //every time checking
  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/")
    }

    if (location?.state?.email) {
      setData((preve) => {
        return {
          ...preve,
          email: location?.state?.email,
        }
      })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      }
    })
  }

  console.log("data reset password", data)

  const handleSubmit = async (e) => {
    e.preventDefault()

    //optional
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirmPassword must be same.")
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword, //change api end pointS
        data: data,
      })

      if (response.data.error) {
        toast.error(response.data.message)
        return
      }

      if (response.data.success) {
        toast.success(response.data.message)

        navigate("/login", {
          state: data,
        })
        setData({
          email: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className=" w-full container mx-auto p-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg"> Enter your Password </p>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1 ">
            <label htmlFor="newPassword">New Password :</label>

            <div className=" bg-blue-50 p-2 border rounded flex items-center focus-within:border-[#ffbf00]">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none "
                name="password"
                value={data.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
              />
              <div
                onClick={() => setShowPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>

          <div className="grid gap-1 ">
            <label htmlFor="confirmPassword">Confirm Password :</label>

            <div className=" bg-blue-50 p-2 border rounded flex items-center focus-within:border-[#ffbf00]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none "
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your confirm password"
              />
              <div
                onClick={() => setShowConfirmPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
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
            Change Password{" "}
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

export default ResetPassword
