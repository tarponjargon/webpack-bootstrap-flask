export const getJson = async (endpoint) => {
  const response = await fetch(endpoint);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return await response.json();
};
