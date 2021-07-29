export const getJson = async (endpoint) => {
  const response = await fetch(endpoint);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return await response.json();
};

export const scrollToEl = (sel = "body") => {
  const offsetTop = document.querySelector(sel).offsetTop;
  scroll({
    top: offsetTop,
    behavior: "smooth",
  });
};
