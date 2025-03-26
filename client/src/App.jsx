import { Outlet } from "react-router-dom"
import "./App.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import toast, { Toaster } from "react-hot-toast"
import fetchUserDetails from "./utils/fetchUserDetails"
import { setUserDetails } from "./store/userSlice"
import { setAllCategory, setAllSubCategory } from "./store/productSlice"
import { useDispatch } from "react-redux"
import Axios from "./utils/Axios"
import SummaryApi from "./common/SummaryApi"
import { useEffect } from "react"

function App() {
  //koi bhi reducer ko call krna ke liye
  const dispatch = useDispatch()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCategory,
      })

      const { data: responseData } = response

      if (responseData.success) {
        console.log("responseData.data", responseData.data)
        dispatch(setAllCategory(responseData.data))
        // setCategoryData(responseData.data)
      }
    } catch (error) {
    } finally {
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
        dispatch(setAllSubCategory(responseData.data))
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
    <>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  )
}

export default App
