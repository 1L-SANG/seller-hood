export const DEV_AUTH_KEY = "sellerhood_dev_authed";

export const setDevAuthed = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(DEV_AUTH_KEY, "true");
  }
};

export const isDevAuthed = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(DEV_AUTH_KEY) === "true";
  }
  return false;
};

export const clearDevAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DEV_AUTH_KEY);
  }
};
