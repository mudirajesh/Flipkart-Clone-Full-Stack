import React, { useState } from "react"
import logo from "../assets/logo.png"
import Search from "./Search"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaRegUserCircle } from "react-icons/fa"
import useMobile from "../hooks/useMobile"
import { IoMdCart } from "react-icons/io"
import { useSelector } from "react-redux"
import { GoTriangleDown, GoTriangleUp } from "react-icons/go"
import UserMenu from "./UserMenu"

const Header = () => {
  const [isMobile] = useMobile()
  const location = useLocation()

  const isSearchPage = location.pathname === "/search"

  const navigate = useNavigate()
  const user = useSelector((state) => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)

  const redirectToLoginPage = () => {
    navigate("/login")
  }

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false)
  }

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login")
      return
    }
    navigate("/user")
  }

  return (
    <header className="h-24  lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center items-center bg-whited">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center justify-between  px-2 ">
          {/**logo */}
          <div className="  h-full  flex">
            <Link to="/" className="h-full flex justify-center items-center  ">
              <img
                src={logo}
                width={170}
                height={60}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={120}
                height={60}
                alt="logo"
                className="lg:hidden "
              />
            </Link>
          </div>

          {/**search */}
          <div className=" hidden lg:block">
            <Search />
          </div>

          {/**login and my cart */}
          <div>
            {/**user icons display in only mobile version */}
            <button
              className=" text-neutral-600 lg:hidden "
              onClick={handleMobileUser}
            >
              <FaRegUserCircle size={26} />
            </button>

            {/**Desktop */}
            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => {
                      setOpenUserMenu((preve) => !preve)
                    }}
                    className="flex select-none items-center gap-2 cursor-pointer"
                  >
                    <p> Account </p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  //openUserMenu true honne se box show hoga
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className="text-lg px-2">
                  Login
                </button>
              )}

              <button className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-2 py-1 rounded text-white">
                {/** add to cart icons */}
                <div className="animate-bounce">
                  <IoMdCart size={26} />
                </div>

                {/** */}
                <div className="font-semibold">My Cart</div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>
    </header>
  )
}

export default Header
