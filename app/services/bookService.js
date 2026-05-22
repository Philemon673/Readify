import axiosInstance from "../utils/axiosInstance";

export const bookService = {
  getFeatured: async () => {
    const response = await axiosInstance.get("/books/featured");
    return response.data;
  },

  getFree: async (q = "bestsellers", maxResults = 12) => {
    const response = await axiosInstance.get(`/books/free`, {
      params: { q, maxResults },
    });
    return response.data;
  },

  getByCategory: async (category, maxResults = 12) => {
    const response = await axiosInstance.get(`/books/category/${category}`, {
      params: { maxResults },
    });
    return response.data;
  },

  search: async (q, startIndex = 0, maxResults = 12) => {
    const response = await axiosInstance.get(`/books/search`, {
      params: { q, startIndex, maxResults },
    });
    return response.data;
  },

  getBookById: async (id) => {
    const response = await axiosInstance.get(`/books/${id}`);
    return response.data;
  },

  // ── Favourites Endpoints ───────────────────────────────────────────
  addFavourite: async (googleBookId, title, authors, thumbnail) => {
    const response = await axiosInstance.post("/favourites", {
      googleBookId,
      title,
      authors: Array.isArray(authors) ? authors.join(", ") : authors || "Unknown Author",
      thumbnail,
    });
    return response.data;
  },

  getFavourites: async () => {
    const response = await axiosInstance.get("/favourites");
    return response.data;
  },

  checkFavourite: async (googleBookId) => {
    const response = await axiosInstance.get(`/favourites/check/${googleBookId}`);
    return response.data;
  },

  removeFavourite: async (googleBookId) => {
    const response = await axiosInstance.delete(`/favourites/${googleBookId}`);
    return response.data;
  },
};
