export const setTheme = (theme) => {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
};

export const getTheme = () => {
  return localStorage.getItem("theme") || "light"; // Default to light theme
};
