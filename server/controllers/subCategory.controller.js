import UploadSubCategoryModel from "../../client/src/components/UploadSubCategoryModel.jsx"
import SubCategoryModel from "../models/subCategory.model.js"

export const AddSubCategoryController = async (request, response) => {
  try {
    const { name, image, category } = request.body

    if (!name && !image && category) {
      return response.status(400).json({
        message: "Provide name , image, category",
        error: true,
        success: false,
      })
    }

    const payload = {
      name,
      image,
      category,
    }

    const createSubCategory = new UploadSubCategoryModel(payload)
    const save = await createSubCategory.save()

    return response.json({
      message: "Sub Category created",
      data: save,
      error: false,
      success: true,
    })
  } catch (error) {
    return response.status(500).json({
      message: "Internal Server Error",
      error: false,
      success: true,
    })
  }
}

export const getSubCategoryController = async (request, response) => {
  try {
    const data = await SubCategoryModel.find()
      .sort({ createdAt: -1 })
      .populate("category")
    return response.json({
      data: data,
      message: "Sub Category data",
      error: false,
      success: true,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

export const updateSubCategoryController = async (request, response) => {
  try {
    const { _id, name, image, category } = request.body

    const checkSub = await SubCategoryModel.findById(_id)

    if (!checkSub) {
      return response.status(400).json({
        message: "Check your id",
        error: true,
        success: false,
      })
    }

    const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id, {
      name,
      image,
      category,
    })

    return response.json({
      message: "Updated Successfully",
      data: updateSubCategory,
      error: false,
      success: true,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

export const deleteSubCategoryController = async (request, response) => {
  try {
    const { _id } = request.body

    const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)

    return response.json({
      message: "Delete Successfully",
      data: deleteSub,
      error: false,
      success: true,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}
