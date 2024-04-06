import { ArrowDownIcon, ArrowUpIcon, ChatAlt2Icon, TrashIcon, } from '@heroicons/react/outline';
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Model from 'react-modal'
import Swal from 'sweetalert2';



const Banner = () => {
    const [redditData, setRedditData] = useState(null);
    const [post, setPost] = useState(null);
    const [upArrowClicked, setUpArrowClicked] = useState(false);
    const [downArrowClicked, setDownArrowClicked] = useState(false);
    const [visiblePost, setVisiblePost] = useState(false);
    const [visibleComment, setVisibleComment] = useState(false);
    const [postIdToUpdate, setPostIdToUpdate] = useState(null);
    const [comments, setComments] = useState(null);
    const [followState, setFollowState] = useState({});
    const [visibleProfile, setVisibleProfile] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({
        title: '',
        description: '',
        image: null
    });


    useEffect(() => {
        // Fetch data when component mounts
        fetchRedditData();
    }, []);

    const fetchRedditData = async () => {
        try {
            const response = await fetch('https://academics.newtonschool.co/api/v1/reddit/channel', {
                headers: {
                    'projectID': 'j5fvhsc8nd79'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data from the API');
            }

            const data = await response.json();

            setRedditData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        // Fetch data when component mounts
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const response = await fetch('https://academics.newtonschool.co/api/v1/reddit/post', {
                headers: {
                    'projectID': 'j5fvhsc8nd79'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data from the API');
            }

            const data = await response.json();

            setPost(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    console.log(post)

    const handleUpArrow = async (id) => {
        if (!localStorage.getItem('token')) {
            toast.error('Please login first to upvote...');
        } else {
            try {
                // Perform upvote action

                const response = await fetch(`https://academics.newtonschool.co/api/v1/reddit/like/${id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'projectID': 'j5fvhsc8nd79'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to upvote the post');
                }

                // Refresh post data after upvoting
                setUpArrowClicked(!upArrowClicked);
                setDownArrowClicked(false);
                fetchPost();
            } catch (error) {
                console.error('Error upvoting post:', error);
            }
        }
    };

    const handleDownArrow = async (id) => {
        if (!localStorage.getItem('token')) {
            toast.error('Please login first to downvote...');
        } else {
            try {
                // Perform downvote action
                const response = await fetch(`https://academics.newtonschool.co/api/v1/reddit/like/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'projectID': 'j5fvhsc8nd79'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to downvote the post');
                }

                // Refresh post data after downvoting
                setDownArrowClicked(!downArrowClicked);
                setUpArrowClicked(false);
                fetchPost();
            } catch (error) {
                console.error('Error downvoting post:', error);
            }
        }
    };


    const handleUpdate = async (id) => {
        setPostIdToUpdate(id); // Set the post ID to update
        setVisiblePost(true); // Open the modal
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', updateFormData.title);
            formData.append('content', updateFormData.description);
            formData.append('images', updateFormData.image);

            const response = await fetch(`https://academics.newtonschool.co/api/v1/reddit/post/${postIdToUpdate}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'projectID': 'j5fvhsc8nd79'
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update the post');
            }

            setVisiblePost(false);
            fetchPost();
            toast.success("Updated...")
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData({
            ...updateFormData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setUpdateFormData({
            ...updateFormData,
            image: e.target.files[0]
        });
    };

    const handleDelete = async (postId) => {
        try {
            const response = await fetch(`https://academics.newtonschool.co/api/v1/reddit/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'projectID': 'j5fvhsc8nd79'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete the post');
            }

            fetchPost();
            toast.success('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Failed to delete the post');
        }
    };



    useEffect(() => {
        // Fetch data when component mounts
        fetchComments();
    }, []);

    const fetchComments = async (postId) => {

        try {
            const response = await fetch(`https://academics.newtonschool.co/api/v1/reddit/post/${postId}/comments`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'projectID': 'j5fvhsc8nd79'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data from the API');
            }

            const data = await response.json();

            setComments(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    const handleCommentDelete = async (commentId) => {
        try {
            const response = await fetch(`https://academics.newtonschool.co/api/v1/reddit/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'projectID': 'j5fvhsc8nd79'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete the comment');
            }

            fetchComments();
            toast.success('Comment deleted successfully');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete the comment');
        }
    };
    const [commentInput, setCommentInput] = useState("");

    const handlePostComment = async (postId, commentContent) => {
        try {
            const response = await fetch(`https://academics.newtonschool.co/api/v1/reddit/comment/${postId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'projectID': 'j5fvhsc8nd79',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: commentContent
                })
            });

            if (!response.ok) {
                throw new Error('Failed to post comment');
            }


            fetchComments(postId);
            toast.success('Comment posted successfully');
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post comment');
        }
    };




    const [followerCounts, setFollowerCounts] = useState({});

    // Function to initialize follower counts with 30 for each post
    const initializeFollowerCounts = () => {
        const initializedCounts = {};
        if (post && post.data) {
            post.data.forEach(postItem => {
                initializedCounts[postItem._id] = 30;
            });
        }
        setFollowerCounts(initializedCounts);
    };

    useEffect(() => {
        initializeFollowerCounts();
    }, [post]);

    const handleFollowToggle = (postId) => {
        setFollowState((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId], // Toggle follow state for the postId
        }));

        setFollowerCounts(prevCounts => ({
            ...prevCounts,
            [postId]: prevCounts[postId] + (followState[postId] ? -1 : 1),
        }));


        if (followState[postId]) {

            Swal.fire({
                icon: "success",
                title: `Unfollowed Post`,
            });

        } else {
            Swal.fire({
                icon: "success",
                title: `Followed Post`,
            });
        }
    };

    const handleProfile = async (post) => {
        setSelectedPost(post);
        setVisibleProfile(true); // Open the modal
    };

    return (
        <div>
            <div style={{ display: "flex", marginTop: "3rem", marginLeft: "2rem" }}>

                {localStorage.getItem('token') ? (
                    <React.Fragment>
                        <div className='postLogin '>

                            {post && post.data && post.data.map(postItem => (
                                <div key={postItem._id} style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
                                    <div className='postItem'>
                                        <div style={{ display: "flex" }}>
                                            <div style={{ margin: "1rem" }}>
                                                {postItem.author.profileImage ? (
                                                    <img src={postItem.author.profileImage} style={{ height: "2rem", borderRadius: "20px" }} />
                                                ) : (
                                                    <img src="default-image-url" style={{ height: "2rem" }} />
                                                )}
                                            </div>

                                            <div onClick={() => handleProfile(postItem)} style={{ marginTop: "1rem", cursor: "pointer" }}><b>{postItem.author.name}</b></div>
                                            <div style={{ marginTop: "1rem", marginLeft: "1rem", marginRight: "1rem" }}>{postItem.createdAt}</div>

                                            <Model isOpen={visibleProfile} onRequestClose={() => setVisibleProfile(false)} style={{
                                                overlay: {
                                                    background: "rgba(0, 0, 0.1, 0.1)",
                                                },
                                                content: {
                                                    width: "600px",
                                                    height: "500px",
                                                    marginLeft: "20rem",
                                                    marginRight: "20rem",
                                                    marginTop: "3rem",
                                                    background: "white"
                                                }
                                            }}>

                                                <div>
                                                    <div style={{ display: "flex" }}>
                                                        <div>
                                                            {selectedPost && selectedPost.author && selectedPost.author.profileImage ? (
                                                                <img src={selectedPost.author.profileImage} style={{ height: "15rem", borderRadius: "120px" }} />
                                                            ) : (
                                                                <img src="default-image-url" style={{ height: "15rem" }} />
                                                            )}
                                                        </div>
                                                        <div style={{ marginTop: "5rem", marginRight: "0.1rem", fontSize: "2.5rem" }}>
                                                            {selectedPost && selectedPost.author ? (
                                                                <b>{selectedPost.author.name}</b>
                                                            ) : (
                                                                <div></div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "2rem" }}>
                                                        <b style={{ fontSize: "2rem" }}>Channels : </b>
                                                        <div>
                                                            {selectedPost && selectedPost.channel ? (
                                                                <div style={{ display: "flex" }}>
                                                                    {selectedPost.channel.image ? (
                                                                        <img src={selectedPost.channel.image} style={{ height: "5rem", borderRadius: "10px" }} />
                                                                    ) : (
                                                                        <img src="default-image-url" style={{ height: "5rem" }} />
                                                                    )}
                                                                    <div style={{marginTop:"1.5rem", marginLeft:"2rem", fontSize:"1.2rem"}}>
                                                                        <b> Channel Name : {selectedPost.channel.name}</b>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div></div>
                                                            )}
                                                        </div>
                                                    </div>


                                                </div>


                                            </Model>

                                        </div>
                                        <div >
                                            <Button onClick={() => handleUpdate(postItem._id)} style={{ marginLeft: "2rem" }}>Update</Button>
                                        </div>
                                        <div style={{ margin: "1rem" }}>
                                            <h4>{postItem.content}</h4>
                                        </div>
                                        <div style={{ margin: "1.3rem" }}>
                                            <img src={postItem.images} style={{ height: "280px", width: "600px" }} />
                                        </div>

                                        <div style={{ display: "flex" }}>
                                            <div style={{ display: "flex" }}>
                                                <ArrowUpIcon onClick={() => handleUpArrow(postItem._id)} style={{ height: "1.5rem", marginLeft: "3rem", cursor: "pointer", marginRight: "1rem", border: upArrowClicked ? "1px solid blue" : "", borderRadius: "15px" }} />{postItem.likeCount}
                                                <ArrowDownIcon onClick={() => handleDownArrow(postItem._id)} style={{ height: "1.5rem", marginLeft: "1rem", cursor: "pointer", border: downArrowClicked ? "1px solid blue" : "", borderRadius: "15px" }} />
                                            </div>
                                            <div onClick={() => { setVisibleComment(true); fetchComments(postItem._id) }} style={{ marginLeft: "2rem", cursor: "pointer", display: "flex" }}>
                                                <b style={{ marginLeft: "3rem" }}>{postItem.commentCount}</b><ChatAlt2Icon style={{ height: "1.5rem", marginRight: "1rem" }} />
                                                Comments
                                            </div>
                                            <div onClick={() => handleDelete(postItem._id)} style={{ marginLeft: "2rem", cursor: "pointer", display: "flex" }}>
                                                <TrashIcon style={{ height: "1.5rem", marginLeft: "3rem", color: "red" }} />
                                                Delete
                                            </div>

                                            <b style={{ marginLeft: "2rem", marginTop: "0.3rem", marginRight: "0.5rem" }}>
                                                {followerCounts[postItem._id]}
                                            </b>
                                            <div style={{ cursor: "pointer", background: "blue", padding: "5px", borderRadius: "15px" }}>

                                                <b onClick={() => handleFollowToggle(postItem._id)}>
                                                    {followState[postItem._id] ? 'Unfollow' : 'Follow'}
                                                </b>
                                            </div>


                                        </div>

                                        {/* for updating post modal */}

                                        <Model isOpen={visiblePost} onRequestClose={() => setVisiblePost(false)} style={{
                                            overlay: {
                                                background: "rgba(0, 0, 0, 0.5)",
                                            },
                                            content: {
                                                width: "600px",
                                                height: "500px",
                                                marginLeft: "20rem",
                                                marginRight: "20rem",
                                                marginTop: "3rem",
                                                background: "white"
                                            }
                                        }}>
                                            <form onSubmit={handleUpdateSubmit}>
                                                <h1 style={{ fontSize: "2rem", color: "orange" }}>Update Post</h1>

                                                <div>
                                                    <input type='text' name='title' value={updateFormData.title} onChange={handleInputChange} min={3} max={50} placeholder='Title' required style={{ width: "30rem", marginTop: "1rem", padding: "5px", marginLeft: "2rem", border: "1px solid gray" }} />
                                                </div>

                                                <div>
                                                    <input type='text' name='description' value={updateFormData.description} onChange={handleInputChange} min={10} max={1000} placeholder='Description' required style={{ width: "30rem", height: "10rem", marginTop: "2rem", padding: "5px", marginLeft: "2rem", border: "1px solid gray" }} />
                                                </div>

                                                <div>
                                                    <input type="file" accept="image/*" name="image" onChange={handleFileChange} style={{ marginTop: "2rem", marginLeft: "2rem" }} />
                                                </div>

                                                <div style={{ marginTop: "2rem", marginLeft: "2rem" }}>
                                                    <button type="submit" style={{ marginRight: "1rem", padding: "5px 10px", backgroundColor: "orange", color: "white", border: "none", borderRadius: "5px" }}>Submit</button>
                                                    <button type="reset" style={{ padding: "5px 10px", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px" }}>Reset</button>
                                                </div>
                                            </form>
                                        </Model>

                                        {/* for showing comment */}

                                        <Model isOpen={visibleComment} onRequestClose={() => setVisibleComment(false)} style={{
                                            overlay: {
                                                background: "rgba(0, 0, 0, 0.5)",
                                            },
                                            content: {
                                                width: "600px",

                                                marginLeft: "20rem",
                                                marginRight: "20rem",
                                                marginTop: "3rem",
                                                background: "white"
                                            }
                                        }}>

                                            <div>

                                                <div style={{ display: "flex" }}>
                                                    <input
                                                        name='comment'
                                                        placeholder='Your comment here'
                                                        style={{ width: "25rem", marginLeft: "2rem", marginTop: "2rem", padding: "10px", marginRight: "1rem" }}
                                                        value={commentInput}
                                                        onChange={(e) => setCommentInput(e.target.value)}
                                                    />
                                                    <Button onClick={() => handlePostComment(postItem._id, commentInput)} style={{ border: "1px solid green", marginTop: "2rem", width: "3rem" }}>Post</Button>
                                                </div>

                                                <b style={{ fontSize: "1.5rem", marginTop: "1rem", color: "orange" }}>All Comments : </b><br />

                                                <ol>
                                                    {comments && comments.data.map((comment, index) => (
                                                        <div key={comment._id}>
                                                            <li style={{ display: "flex", marginTop: "1rem", fontSize: "1.2rem" }}>
                                                                <b style={{ marginRight: "1rem" }}>{index + 1}. {comment.author_details.name} : </b>
                                                                <p>{comment.content}</p>
                                                                <TrashIcon onClick={() => handleCommentDelete(comment._id)} style={{ height: "1.5rem", color: "red", textAlign: "right", cursor: "pointer" }} />
                                                            </li>
                                                        </div>
                                                    ))}
                                                </ol>


                                            </div>

                                        </Model>


                                    </div>
                                </div>
                            ))}


                        </div>

                    </React.Fragment>

                ) :
                    (

                        <React.Fragment>

                            <div className='community'>
                                <h1 className='commHead' >Popular Community</h1>

                                {redditData && redditData.data.map(item => (
                                    <div key={item.id} style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
                                        <div style={{ display: "flex" }}>
                                            <div> <img src={item.image} style={{ height: "3rem" }} /> </div>
                                            <div style={{ marginTop: "0.2rem", marginLeft: "1rem" }}>
                                                <b>{item.name}</b>
                                            </div>

                                        </div>


                                    </div>
                                ))}



                            </div>


                            <div className='post lg:ml-40'>

                                {post && post.data.map(postItem => (
                                    <div key={postItem._id} style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
                                        <div className='postItem'>
                                            <div style={{ display: "flex" }}>
                                                <div style={{ margin: "1rem" }}>
                                                    {postItem.author.profileImage ? (
                                                        <img src={postItem.author.profileImage} style={{ height: "2rem", borderRadius: "20px" }} />
                                                    ) : (
                                                        <img src="default-image-url" style={{ height: "2rem" }} />
                                                    )}
                                                </div>

                                                <div style={{ marginTop: "1rem" }}><b>{postItem.author.name}</b></div>
                                                <div style={{ marginTop: "1rem", marginLeft: "1rem", marginRight: "1rem" }}>{postItem.createdAt}</div>
                                            </div>
                                            <div style={{ margin: "1rem" }}>
                                                <h4>{postItem.content}</h4>
                                            </div>
                                            <div style={{ margin: "1.3rem" }}>
                                                <img src={postItem.images} style={{ height: "280px", width: "600px" }} />
                                            </div>

                                            <div style={{ display: "flex" }}>
                                                <div style={{ display: "flex" }}>
                                                    <ArrowUpIcon onClick={() => handleUpArrow(postItem._id)} style={{ height: "1.5rem", marginLeft: "3rem", cursor: "pointer" }} />{postItem.likeCount}
                                                    <ArrowDownIcon onClick={() => handleDownArrow(postItem._id)} style={{ height: "1.5rem", marginLeft: "3rem", cursor: "pointer" }} />{postItem.dislikeCount}
                                                </div>
                                                <div style={{ marginLeft: "20rem", cursor: "pointer", display: "flex" }}>
                                                    <ChatAlt2Icon style={{ height: "1.5rem", marginLeft: "3rem" }} />
                                                    Comments
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                ))}


                            </div>

                        </React.Fragment>
                    )}




            </div >
        </div>

    );
};

export default Banner;
