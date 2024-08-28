import { toast } from "react-toastify";

export const showToast = (status, message) => {
  return toast[status](message);
};
