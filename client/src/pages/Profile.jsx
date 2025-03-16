import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaUserAlt } from "react-icons/fa"
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit"
import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import AxiosToastError from "../utils/AxiosToastError"
import toast from "react-hot-toast"
import fetchUserDetails from "../utils/fetchUserDetails"
import { setUserDetails } from "../store/userSlice"

const Profile = () => {
  const user = useSelector((state) => state.user)
  console.log("profile", user)

  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false)
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  })

  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    })
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        const userData = await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setUserData((preve) => {
      return {
        ...preve,
        [name]: value,
      }
    })
  }

  return (
    <div>
      {/**profile uplaod and display image */}
      <div className="w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shawdow-sm">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full" />
        ) : (
          <FaUserAlt size={65} />
        )}
      </div>

      <button
        onClick={() => {
          setProfileAvatarEdit(true)
        }}
        className="text-sm w-20 border border-[#ffc929] hover:border-[#ffbf00] hover:bg-[#ffbf00] px-3 py-1 rounded-full mt-3"
      >
        Edit
      </button>

      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setProfileAvatarEdit} />
      )}

      {/**name, mobile, email change password*/}
      <form onSubmit={handleSubmit} className="my-4 grid gap-4">
        <div className="grid">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="p-2 bg-blue-50 outline-none border
          focus-within: border-[#ffbf00] rounded"
            value={userData.name}
            name="name"
            onChange={handleOnChange}
            required
          />
        </div>

        <div className="grid">
          <label htmlFor="email">Name</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="p-2 bg-blue-50 outline-none border
          focus-within: border-[#ffbf00] rounded"
            value={userData.email}
            name="email"
            onChange={handleOnChange}
            required
          />
        </div>

        <div className="grid">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter your mobile"
            className="p-2 bg-blue-50 outline-none border
          focus-within: border-[#ffbf00] rounded"
            value={userData.mobile}
            name="mobile"
            onChange={handleOnChange}
            required
          />
        </div>

        <button className="border px-4 py-2 font-semibold hover:bg-[#ffc929] border-[#ffc929] text-[#ffc929] hover:text-neutral-800 rounded">
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  )
}

export default Profile
