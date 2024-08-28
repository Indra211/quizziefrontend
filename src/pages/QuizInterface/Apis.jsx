import axios from "axios";
import { Apis } from "../../Apis";

export const CorrectionAnswerApi = async ({ id, selectedOption }) => {
  try {
    const response = await axios.post(
      Apis.chkCorrectOption(id),
      { selectedOption },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const SelectedOptionApi = async ({ id, selectedOption }) => {
  try {
    const response = await axios.post(
      Apis.selectedOption(id),
      { selectedOption },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
