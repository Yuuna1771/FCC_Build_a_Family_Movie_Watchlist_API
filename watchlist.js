
import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie
} from "../utils/db.js";

const router = express.Router();

router.use(authenticate);

// GET a user's watchlist
router.get("/:userId", (req, res) => {
  try {
    const watchlist = getWatchlist(req.params.userId);

    if (watchlist === null) {
      return res.status(404).json({
        error: "User not found."
      });
    }

    return res.status(200).json(watchlist);
  } catch (error) {
    console.error("Get watchlist error:", error);
    return res.status(500).json({
      error: "Internal server error."
    });
  }
});

// Add a movie
router.post(
  "/:userId/movies",
  authorizeModification,
  (req, res) => {
    try {
      const movie = addMovie(req.params.userId, req.body ?? {});

      if (movie === null) {
        return res.status(404).json({
          error: "User not found."
        });
      }

      return res.status(201).json(movie);
    } catch (error) {
      console.error("Add movie error:", error);
      return res.status(500).json({
        error: "Internal server error."
      });
    }
  }
);

// Update a movie
router.put(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    try {
      const movieId = Number(req.params.movieId);

      if (!Number.isInteger(movieId) || movieId < 1) {
        return res.status(404).json({
          error: "Movie not found."
        });
      }

      const movie = updateMovie(
        req.params.userId,
        movieId,
        req.body ?? {}
      );

      if (movie === null) {
        return res.status(404).json({
          error: "Movie not found."
        });
      }

      return res.status(200).json(movie);
    } catch (error) {
      console.error("Update movie error:", error);
      return res.status(500).json({
        error: "Internal server error."
      });
    }
  }
);

// Delete a movie
router.delete(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    try {
      const movieId = Number(req.params.movieId);

      if (!Number.isInteger(movieId) || movieId < 1) {
        return res.status(404).json({
          error: "Movie not found."
        });
      }

      const deleted = deleteMovie(
        req.params.userId,
        movieId
      );

      if (!deleted) {
        return res.status(404).json({
          error: "Movie not found."
        });
      }

      return res.status(200).json({
        message: "Movie deleted successfully."
      });
    } catch (error) {
      console.error("Delete movie error:", error);
      return res.status(500).json({
        error: "Internal server error."
      });
    }
  }
);

export default router;
