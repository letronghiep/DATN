import { axiosInstance } from "../../core/axiosInstance";
import { apiOrigin } from "~/constants";
export async function getBanners() {
  try {
    const res = await axiosInstance.get(`${apiOrigin}/banner`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
