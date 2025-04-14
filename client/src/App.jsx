import { Outlet, useLocation } from "react-router-dom"
import "./App.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import toast, { Toaster } from "react-hot-toast"
import fetchUserDetails from "./utils/fetchUserDetails"
import { setUserDetails } from "./store/userSlice"
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice"
import { useDispatch } from "react-redux"
import Axios from "./utils/Axios"
import SummaryApi from "./common/SummaryApi"
import { handleAddItemCart } from "./store/cartProduct"
import { useEffect } from "react"
import GlobalProvider from "./provider/GlobalProvider"
import { FaCartShopping } from "react-icons/fa6"
import CartMobileLink from "./components/CartMobile"

function App() {
  //koi bhi reducer ko call krna ke liye
  const dispatch = useDispatch()

  //in check out page view cart is not showing (location.pathname)
  const location = useLocation()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...SummaryApi.getCategory,
      })

      const { data: responseData } = response

      if (responseData.success) {
        dispatch(
          setAllCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        )
        // setCategoryData(responseData.data)
      }
    } catch (error) {
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      })

      const { data: responseData } = response

      if (responseData.success) {
        console.log("responseData.data", responseData.data)
        dispatch(
          setAllSubCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        )
        // setCategoryData(responseData.data)
      }
    } catch (error) {
    } finally {
    }
  }

  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
  }, [])

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {location.pathname !== "/checkout" && <CartMobileLink />}
    </GlobalProvider>
  )
}

export default App
