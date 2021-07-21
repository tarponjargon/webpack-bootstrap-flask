export const getJson = async (endpoint) => {
  const response = await fetch(endpoint);
  return await response.json();
};
