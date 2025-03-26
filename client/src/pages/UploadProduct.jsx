import React, { useEffect, useState } from "react"
import { FaCloudUploadAlt } from "react-icons/fa"
import uploadImage from "../utils/UploadImage"
import Loading from "../components/Loading"
import ViewImage from "../components/ViewImage"
import { MdDelete } from "react-icons/md"
import { useSelector } from "react-redux"
import { IoClose } from "react-icons/io5"
import AxiosToastError from "../utils/AxiosToastError"
import SummaryApi from "../common/SummaryApi"
import successAlert from "../utils/SuccessAlert"
import Axios from "../utils/Axios"

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  })

  const [imageLoading, setImageLoading] = useState(false)
  const [viewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector((state) => state.product.allCategory)
  // multiple select category
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector((state) => state.product.allSubCategory)

  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      }
    })
  }

  //image array mei image ja chuka hh
  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }

    setImageLoading(true)

    const response = await uploadImage(file)
    const { data: ImageResponse } = response
    const imageUrl = ImageResponse.data.url

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl],
      }
    })
    setImageLoading(false)
  }

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1)
    setData((preve) => {
      return {
        ...preve,
      }
    })
  }

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1)
    setData((preve) => {
      return {
        ...preve,
      }
    })
  }

  const handleAddField = () => {
    setData((...preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: "",
        },
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("data", data)
    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data,
      })

      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  // //for testing purpose
  // useEffect(() => {
  //   successAlert("Upload successfully")
  // }, [])

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Upload Product</h2>
      </div>

      <div className="grid p-3 ">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div classaName="grid gap-1">
            <label htmlFor="name" className="font-medium">
              {" "}
              Name:{" "}
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter product name"
              name="name"
              value={data.name}
              onChange={handleChange}
              classname="bg-blue-50 p-2 outline-none border focus-within:border-[#ffbf00] rounded"
              required
            />
          </div>
          <div classaName="grid gap-1">
            <label htmlFor="description " className="font-medium">
              {" "}
              Description:{" "}
            </label>
            <textarea
              id="description"
              type="text"
              placeholder="Enter product description"
              name="name"
              value={data.description}
              onChange={handleChange}
              required
              multiple
              row={3}
              classname="bg-blue-50 p-2 outline-none border focus-within:border-[#ffbf00] rounded resize-none"
            />
          </div>
          <div>
            <p className="font-medium"> Image </p>
            <div>
              <label
                htmlFor="productImage"
                className="bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer"
              >
                <div className="text-center flex justify-center items-center flex-col">
                  {imageLoading ? (
                    <Loading />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={35} />
                      <p> Upload Image </p>
                    </>
                  )}
                </div>

                <input
                  type="file"
                  id="productImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                />
              </label>

              {/** display upload image */}

              <div className="flex flex-wrap gap-4">
                {data.image.map((img, index) => {
                  return (
                    <div
                      key={img + index}
                      className="h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group "
                    >
                      <img
                        src={img}
                        alt={img}
                        className="w-full h-full object-scale-down cursor-pointer "
                        onClick={() => {
                          setViewImageURL(img)
                        }}
                      />
                      <div
                        onClick={() => {
                          handleDeleteImage(index)
                        }}
                        className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer"
                      >
                        <MdDelete />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          //upar ka function missing h
          <div className="grid gap-1">
            <label className="font-medium"> Sub Category </label>
            <div>
              <select
                className="bg-blue-50 border w-full p-2 rounded "
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value
                  const subCategory = allSubCategory.find(
                    (el) => el._id === value
                  )

                  setData((preve) => {
                    return {
                      ...preve,
                      subCategory: [...preve.subCategory, subCategory],
                    }
                  })

                  setSelectSubCategory("")
                }}
              >
                <option value={""} className="text-neutral-600">
                  {" "}
                  Select sub Category
                </option>
                {allSubCategory.map((c, index) => {
                  return (
                    <option value={c?._id + index + "productsection"}>
                      {c.name}
                    </option>
                  )
                })}
              </select>

              <div className="flex flex-wrap gap-3">
                {data.subCategory.map((c, index) => {
                  return (
                    <div
                      key={c._id + index + "productsection"}
                      className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                    >
                      <p>{c.name}</p>
                      <div
                        className="hover:text-red-500 cursor-pointer"
                        onClick={() => handleRemoveSubCategory(index)}
                      >
                        <IoClose size={20} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div classaName="grid gap-1">
            <label htmlFor="unit" className="font-medium">
              {" "}
              Unit:{" "}
            </label>
            <input
              id="unit"
              type="text"
              placeholder="Enter product unit"
              name="unit"
              value={data.unit}
              onChange={handleChange}
              required
              classname="bg-blue-50 p-2 outline-none border focus-within:border-[#ffbf00] rounded"
            />
          </div>
          <div classaName="grid gap-1">
            <label htmlFor="stock"> Number of Stock: </label>
            <input
              id="stock"
              type="number"
              placeholder="Enter product stock"
              name="stock"
              value={data.stock}
              onChange={handleChange}
              required
              classname="bg-blue-50 p-2 outline-none border focus-within:border-[#ffbf00] rounded"
            />
          </div>
          <div classaName="grid gap-1">
            <label htmlFor="price" className="font-medium">
              {" "}
              Price:{" "}
            </label>
            <input
              id="stock"
              type="number"
              placeholder="Enter product price"
              name="price"
              value={data.price}
              onChange={handleChange}
              required
              classname="bg-blue-50 p-2 outline-none border focus-within:border-[#ffbf00] rounded"
            />
          </div>
          <div classaName="grid gap-1">
            <label htmlFor="discount" className="font-medium">
              {" "}
              Discount:{" "}
            </label>
            <input
              id="discount"
              type="number"
              placeholder="Enter percentage discount"
              name="discount"
              value={data.discount}
              onChange={handleChange}
              required
              classname="bg-blue-50 p-2 outline-none border focus-within:border-[#ffbf00] rounded"
            />
          </div>
          {/** add more fields */}
          {Object?.keys(data?.more_details)?.map((k, index) => {
            return (
              <div classaName="grid gap-1">
                <label htmlFor={k} className="font-medium">
                  {" "}
                  {k}{" "}
                </label>
                <input
                  id={k}
                  type="text"
                  value={data?.more_details[k]}
                  onChange={(e) => {
                    const value = e.target.value
                    setData((preve) => {
                      return {
                        ...preve,
                        more_details: {
                          ...preve.more_details,
                          [k]: value,
                        },
                      }
                    })
                  }}
                  required
                  classname="bg-blue-50 p-2 outline-none border focus-within:border-[#ffbf00] rounded"
                />
              </div>
            )
          })}
          <div
            onClick={() => setOpenAddField(true)}
            className="inline-block hover:bg-[#ffc929] bg-white
          py-1 px-3 w-32 text-center font-semibold border border-[#ffbf00]
          hover:text-neutral-900 cursor-pointer rounded"
          >
            Add Fields
          </div>
          <button className="hover:bg-[#ffbf00] bg-[#ffc929] py-2 rounded font-semibold">
            Submit
          </button>
        </form>
      </div>

      {viewImageURL && (
        <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />
      )}

      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => {
            setFieldName(e.target.value)
          }}
          submit={handleAddField}
          close={() => {
            setOpenAddField(false)
          }}
        />
      )}
    </section>
  )
}

export default UploadProduct
