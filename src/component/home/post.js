import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import { useLocation } from 'react-router-dom';
import { ArrowDownIcon, ArrowUpIcon, ChatAlt2Icon } from '@heroicons/react/outline';

const Post = () => {
  const location = useLocation();
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    if (location.state && location.state.searchTerm) {
      handleSearch(location.state.searchTerm);
    }
  }, [location.state]);

  const handleSearch = async (searchTerm) => {
    try {
      const response = await fetch(`https://academics.newtonschool.co/api/v1/reddit/post?search={"field":"${searchTerm}"}`, {
        method: "GET",
        headers: {
          'projectID': 'j5fvhsc8nd79'
        }
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log("success");
        setPostData(prevData => [...prevData, data]); 
      } else {
        console.log("Error:", data); 
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <div className='post'>
          {postData &&postData.data&& postData.length > 0 ? (
            postData.data.map(postItem => (
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
                      <ArrowUpIcon  style={{ height: "1.5rem", marginLeft: "3rem", cursor: "pointer" }} />{postItem.likeCount}
                      <ArrowDownIcon  style={{ height: "1.5rem", marginLeft: "3rem", cursor: "pointer" }} />{postItem.dislikeCount}
                    </div>
                    <div style={{ marginLeft: "20rem", cursor: "pointer", display: "flex" }}>
                      <ChatAlt2Icon style={{ height: "1.5rem", marginLeft: "3rem" }} />
                      Comments
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{color:"red", marginTop:"3rem", fontSize:"3rem"}}><u>No relevant data found related your search</u></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
