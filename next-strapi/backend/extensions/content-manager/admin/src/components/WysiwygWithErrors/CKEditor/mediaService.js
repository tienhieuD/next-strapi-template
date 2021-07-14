import Axios from 'axios'
// const API_URL = process.env.REACT_APP_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
export async function updateLoadMediaByCourse({ resource, file = true }) {
    let formData = new FormData();
    formData.append("files", resource);
    // formData.append("organization", API_URL);
    // if (file) formData.append("files", file);
    const url = "/upload";
    console.log(url)
    const response = await postFormAsync(url, formData, true);
    return response;
}

function getCookie(name = "access_token") {
  const v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : null;
}

export async function postFormAsync(url, data, hasForm = false) {
  try {
      let formData;
      if (hasForm) formData = data;
      else {
          formData = new FormData();
          for (const i in data) {
              formData.append(i, data[i]);
          }
      }
      if (!formData) return;
      const response = await Axios.post(url, formData, {
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken")),
          },
      });
      console.log(response, 'response')
      return response;
  } catch (ex) {
    console.log(ex, 'ex')
      const { status = 400, data = {}, errors = [] } = ex.response || {};
      const error = data?.errors || [];
      return {
          status,
          data: ex.response.data || {},
          errors,
          message: error[0]?.message || "",
      };
  }
}