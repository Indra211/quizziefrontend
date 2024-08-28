// export const baseUrl = `http://127.0.0.1:8000/api/v1`;
export const baseUrl = `https://quizziebackend-y1x1.onrender.com/api/v1`;

export const Apis = {
  login: `${baseUrl}/login`,
  signup: `${baseUrl}/signup`,
  createQuiz: `${baseUrl}/createQuiz`,
  incImpression: (id) => `${baseUrl}/updateImpressions/${id}`,
  chkCorrectOption: (id) => `${baseUrl}/checkOption/${id}`,
  selectedOption: (id) => `${baseUrl}/selectedOption/${id}`,
  getAllQuizzes: `${baseUrl}/getAllQuizes`,
  getQuizQuestions: (id) => `${baseUrl}/getQuizQuestion/${id}`,
  getQuizData: `${baseUrl}/getQuizData`,
  deleteQuiz: (id) => `${baseUrl}/deleteQuiz/${id}`,
  updateQuiz: `${baseUrl}/updateQuiz`,
};
