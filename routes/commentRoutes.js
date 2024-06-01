const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.post("/:id/comments", commentController.createComment);
router.get("/:id/comments", commentController.getAllComments);
router.delete("/:id/comments/:commentid", commentController.deleteComment);

module.exports = router;
