import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import morgan from "morgan" // api for
import helmet from "helmet"
import connectDB from "./config/connectDB.js"
import userRouter from "./route/user.route.js"
import categoryRouter from "./route/category.route.js"
import uploadRouter from "./route/upload.route.js"
import subCategoryRouter from "./route/subCategory.route.js"
import productRouter from "./route/product.route.js"
import cartRouter from "./route/cart.route.js"

const app = express()
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
)

app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
)

const PORT = 8080 || process.env.PORT

app.get("/", (request, response) => {
  // server to clint
  response.json({
    message: "Server is running " + PORT,
  })
})

app.use("/api/user", userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is listening on port ", PORT)
  })
})
