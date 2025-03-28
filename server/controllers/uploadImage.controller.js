import uploadImageCloudinary from "../utils/uploadImageCloudary.js"

const uploadImageController = async (request, response) => {
  try {
    const file = request.file
    console.log(file)

    const uploadImage = await uploadImageCloudinary(file)

    return response.json({
      message: "Upload done",
      data: uploadImage,
      sucess: true,
      error: false,
    })
  } catch (error) {
    return response.status.json(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

export default uploadImageController
