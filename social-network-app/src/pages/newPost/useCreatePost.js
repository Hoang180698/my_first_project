import { useEffect, useState } from "react";

const useCreatePost = () => {

    const onCreatePost = () => {
        document.getElementById("np-comment").classList.add("np-block")
    };

    const offCreatePost = () =>{
        document.getElementById("np-comment").classList.remove("np-block");
    }

    return {
        onCreatePost,
        offCreatePost
    }
}

export default useCreatePost;