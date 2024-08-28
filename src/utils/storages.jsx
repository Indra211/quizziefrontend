export const storeData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const retriveData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const RemoveData = (key) => {
  localStorage.removeItem(key);
};
