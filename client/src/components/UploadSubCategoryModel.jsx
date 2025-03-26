import React, { useState } from "react"
import { IoClose } from "react-icons/io5"
import uploadImage from "../utils/UploadImage"
import { useSelector } from "react-redux"
import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import AxiosToastError from "../utils/AxiosToastError"
import toast from "react-hot-toast"

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: [],
  })

  const allCategory = useSelector((state) => state.product.allCategory)

  console.log("all category sub category page", allCategory)

  const handleChange = (e) => {
    const { name, value } = e.target

    setSubCategoryData((preve) => {
      return {
        ...preve,
        [name]: value,
      }
    })
  }

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.file[0]

    if (!file) {
      return
    }

    const response = await uploadImage(file)
    const { data: ImageResponse } = response

    setSubCategoryData((preve) => {
      return {
        ...preve,
        image: ImageResponse.data.url,
      }
    })
  }

  const handleRemoveCategorySelected = (categoryId) => {
    const index = subCategoryData.category.findIndex(
      (el) => el._id === categoryId
    )

    subCategoryData.category.splice(index, 1)
    setSubCategoryData((preve) => {
      return {
        ...preve,
      }
    })
  }

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: subCategoryData,
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (close) {
          close()
        }

        if (fetchData) {
          fetchData()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <section className="fixed top-0 buttom-0 right-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="w-full max-5-xl bg-white p-4 rounded">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-semibold">Add Sub Category </h1>
          <button>
            <IoClose onClick={close} size={25} />
          </button>
        </div>

        <form className="my-3 grid gap-3" onSumbit={handleSubmitSubCategory}>
          <div className="grid gap-1">
            <label htmlfor="name"> Name </label>
            <input
              id="name"
              value={subCategoryData.name}
              onChange={handleChange}
              className="p-3 bg-blue-50 outline-none focus-within:border-[#ffbf00] rounded"
            />
          </div>

          <div className="grid gap-1">
            <p> Image </p>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center">
                {!subCategoryData.image ? (
                  <p className="text-sm text-neutral-400"> No Image</p>
                ) : (
                  <img
                    alt="subCategory"
                    src={subCategoryData.image}
                    className="w-full h-full object-scale-down"
                  />
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage">
                <div className="px-4 py-1 border border-[#ffc929] text-[#ffbf00] rounded hover:bg-[#ffc929] hover:text-neutral-900 cursor-pointer">
                  Upload Image
                </div>
                <input
                  type="file"
                  id="uploadSubCategoryImage"
                  className="hidden"
                  onChange={handleUploadSubCategoryImage}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-1">
            <label> Select Category </label>
            <select className="bg-blue-50 border p-3 ">
              <option value={""}>Select Category</option>
            </select>
          </div>

          <div className="grid gap-1">
            <label> Select Category </label>
            <div className="border focus-within:border-[#ffbf00]  rounded">
              {/* display category **/}

              <div className="flex flex-wrap gap-2">
                {subCategoryData.category.map((cat, index) => {
                  return (
                    <p
                      key={cat._id + "selectedValue"}
                      className="bg-white shadow-md px-1 m-1 flex items-center gap-2"
                    >
                      {cat.name}
                      <div
                        className="cursor-pointer hover:text-red-600"
                        onClick={() => handleRemoveCategorySelected(cat._id)}
                      >
                        <IoClose size={20} />
                      </div>
                    </p>
                  )
                })}
              </div>

              {/* select category **/}
              <select
                className="w-full p-2 bg-transparent outline-none border"
                onChange={(e) => {
                  const value = e.target.value
                  const categoryDetails = allCategory.find(
                    (el) => el._id == value
                  )

                  setSubCategoryData((preve) => {
                    return {
                      ...preve,
                      category: [...preve.category, categoryDetails],
                    }
                  })
                }}
              >
                <option value={""} disabled>
                  {" "}
                  Select Category{" "}
                </option>

                {allCategory.map((category, index) => {
                  return (
                    <option
                      value={category?._id}
                      key={category._id + "subcategory"}
                    >
                      {category?.name}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          <button
            className={` px-4 py-1 border
            ${
              subCategoryData?.name &&
              subCategoryData?.image &&
              subCategoryData?.category[0]
                ? "bg-[#ffbf00] hover:bg-[#ffc929]"
                : "bg-gray-200"
            }
            font-semibold
            `}
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  )
}

export default UploadSubCategoryModel
