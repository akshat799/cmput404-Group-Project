import React, { useCallback, useEffect, useState } from "react";


const PublicPost = () => {
    useEffect(() => {
        document.title = 'Posts';
    }), []);

    const [post, setPosts] = useState([]);

    // const getPublicPosts = useCallback(() => {

    // })
}
