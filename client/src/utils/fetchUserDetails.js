//user login honne se user ka data lekr ana ka kaam krega

import Axios from "./Axios"
import SummaryApi from "../common/SummaryApi"

const fetchUserDetails = async () => {
  const response = await Axios({
    ...SummaryApi.userDetails,
  })
  return response.data
}

export default fetchUserDetails
