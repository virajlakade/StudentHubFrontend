import { useEffect, useState } from "react";
import axios from "axios";
import "./ConfessionComments.css";

export default function ConfessionComments({ confessionId }) {

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadComments();
    }, [confessionId]);

    const loadComments = async () => {
        try {

            const response = await axios.get(
                `http://localhost:8090/api/comments/${confessionId}`
            );

            setComments(response.data);

        } catch (err) {

            console.error(
                "Failed to load comments",
                err
            );

        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!newComment.trim()) {
            setError("Comment cannot be empty.");
            return;
        }

        try {

            await axios.post(
                `http://localhost:8090/api/comments/${confessionId}`,
                {
                    commentText: newComment
                }
            );

            setNewComment("");
            setError("");

            // Reload comments from DB
            loadComments();

        } catch (err) {

            console.error(
                "Failed to save comment",
                err
            );

        }
    };

    return (
        <div className="conf-comments-section">

            <h3 className="comments-heading">
                Discussion ({comments.length})
            </h3>

            {/* Comment Form */}
            <form
                onSubmit={handleSubmit}
                className="comment-form-box"
            >

        <textarea
            value={newComment}
            onChange={(e) => {
                setNewComment(e.target.value);
                setError("");
            }}
            placeholder="Reply anonymously..."
            rows="3"
            className={`comment-textarea ${
                error ? "error" : ""
            }`}
        />

                {error && (
                    <span className="comment-error-msg">
            {error}
          </span>
                )}

                <div className="comment-form-actions">

                    <button
                        type="submit"
                        className="comment-btn-submit"
                    >
                        Comment Anonymously
                    </button>

                </div>

            </form>

            {/* Comments */}
            <div className="comments-list">

                {comments.length > 0 ? (

                    comments.map((comment) => (

                        <div
                            key={comment.id}
                            className="comment-bubble"
                        >

                            <div className="comment-bubble-header">

                <span className="comment-author">
                  Anonymous Student
                </span>

                                <span className="comment-time">

                  {comment.createdAt
                      ? new Date(
                          comment.createdAt
                      ).toLocaleDateString()
                      : ""}

                </span>

                            </div>

                            <p className="comment-text">
                                {comment.commentText}
                            </p>

                        </div>

                    ))

                ) : (

                    <p className="no-comments-prompt">
                        No comments yet.
                        Start the discussion!
                    </p>

                )}

            </div>

        </div>
    );
}