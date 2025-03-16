import React, { useState, useEffect } from "react"
import { IoMdSearch } from "react-icons/io"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { TypeAnimation } from "react-type-animation"
import { FaArrowLeft } from "react-icons/fa"
import useMobile from "../hooks/useMobile"

const Search = () => {
  const navigate = useNavigate()

  const location = useLocation()

  const [isSearchPage, setIsSearchPage] = useState(false)

  //useMobile hooks
  const [isMobile] = useMobile()

  useEffect(() => {
    const isSearch = location.pathname === "/search"
    setIsSearchPage(isSearch)
  }, [location])

  const redirectToSearchPage = () => {
    navigate("/search")
  }

  return (
    <div className=" w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-[#ffbf00]">
      <div>
        {isMobile && isSearchPage ? (
          <Link
            to="/"
            className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-[#ffbf00] bg-white rounded-full shadow-md"
          >
            <FaArrowLeft size={22} />
          </Link>
        ) : (
          <button className=" flex justify-center items-center  h-full p-3 group-focus-within:text-[#ffbf00]">
            <IoMdSearch size={22} />
          </button>
        )}
      </div>

      <div className=" w-full h-full ">
        {!isSearchPage ? (
          //not in search page

          <div
            onClick={redirectToSearchPage}
            className=" w-full h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                'Search "milk"', // Types 'One'
                1000, // Waits 1s
                'Search "bread"', // Deletes 'One' and types 'Two'
                1000, // Waits 2s
                'Search "panner"', // Types 'Three' without deleting 'Two'
                1000,
                'Search "sugar"',
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          //when i was search page

          <div className=" w-full h-full">
            <input
              type=" text"
              placeholder=" Search for atta dal and more."
              autoFocus={true}
              className="bg-transparent  w-full h-full outline-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
