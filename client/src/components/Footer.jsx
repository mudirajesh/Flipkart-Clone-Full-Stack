import React from "react"
import { FaFacebookF } from "react-icons/fa"
import { FaInstagram } from "react-icons/fa"
import { FaLinkedinIn } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2 ">
        <p> © All Rights Reserved 2025</p>

        <div className="flex justify-center items-center gap-4 text-2xl">
          <a href="" className="hover:text-[#ffc929]">
            {" "}
            <FaFacebookF />{" "}
          </a>

          <a href="" className="hover:text-[#ffc929]">
            <FaInstagram />
          </a>

          <a href="" className="hover:text-[#ffc929]">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
