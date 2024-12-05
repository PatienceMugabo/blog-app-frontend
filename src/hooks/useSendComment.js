import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useStore from "../../zustand/useStore";

const useSendComment = () => {
    const [loading, setLoading] = useState(false);
    const { selectedBlog, setSelectedBlog } = useStore();
    let socket = null;

    useEffect(() => {
        // Establish WebSocket connection
        socket = new WebSocket('ws://localhost:8081/ws');

        socket.onopen = () => {
            console.log('Connected to WebSocket');
        };

        socket.onmessage = (event) => {
            const receivedComment = JSON.parse(event.data);
            setSelectedBlog((prevState) => ({
                ...prevState,
                blog_comment: [...prevState.blog_comment, receivedComment]
            }));
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [setSelectedBlog]);

    const sendComment = async (comment, blogId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/comments/${blogId}/newComment`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: comment })
            });
            const newComment = await res.json();

            if (!res.ok) {
                throw new Error("Error on send comment");
            }

            // Send the comment through WebSocket
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ username: 'User1', message: comment }));
            }

            toast.success("Comment sent successfully!");

            setSelectedBlog((prevState) => ({
                ...prevState,
                blog_comment: [...prevState.blog_comment, newComment]
            }));
        } catch (error) {
            console.log(error);
            toast.error("Failed to send comment. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return { loading, sendComment };
};

export default useSendComment;
