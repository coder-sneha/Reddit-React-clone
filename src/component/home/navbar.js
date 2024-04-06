import React, { useState } from 'react';
import logo from '../home/oip.png';
import logoName from '../home/white-logo-name.png';
import { BellIcon, ChatIcon, PlusIcon, SearchIcon } from '@heroicons/react/outline'
import Model from 'react-modal'
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import av from '../home/av.png'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Navbar = () => {

    const [visibleLogin, setVisibleLogin] = useState(false);
    const [visibleSignup, setVisibleSignup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await fetch('https://academics.newtonschool.co/api/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'projectID': 'j5fvhsc8nd79'
                },
                body: JSON.stringify({
                    email: event.target.email.value,
                    password: event.target.password.value,
                    appType: 'reddit'
                })
            });
            const data = await response.json();
            console.log(data);
            if (response) {
                setVisibleLogin(false);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.data.name);

                toast.success("Login Successful...")
                // setTimeout(function() {
                //     localStorage.removeItem('token');
                //     localStorage.removeItem('username');

                // }, 5 * 60 * 1000); 
            } else {
                toast.error("Incorrect credentials")
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleSignup = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await fetch('https://academics.newtonschool.co/api/v1/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'projectID': 'j5fvhsc8nd79'
                },
                body: JSON.stringify({
                    name: event.target.name.value,
                    email: event.target.email.value,
                    password: event.target.password.value,
                    appType: 'reddit'
                })
            });
            const data = await response.json();
            console.log(data);
            if (response) {
                setVisibleSignup(false);
                toast.success("Registration Successful...")
            } else {
                toast.error("Registration Failed...User Exists")
            }
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    const [visiblePost, setVisiblePost] = useState(false);

    const handlePost = async (event) => {
        event.preventDefault(); 
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', event.target.title.value);
            formData.append('content', event.target.description.value);
            formData.append('images', event.target.image.files[0]);
    
            const response = await fetch('https://academics.newtonschool.co/api/v1/reddit/post/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'projectID': 'j5fvhsc8nd79'
                },
                body: formData
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setVisiblePost(false);
                Swal.fire({
                    icon: "success",
                    title: `Post successful`,
                });
                event.target.reset();
            } else {
                toast.error("Post Failed...");
            }
        } catch (error) {
            console.error('Post failed:', error);
        }
    };
    
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value); 
    };

    const handleSearch =  () => {
       navigate('/searchPost', { state: { searchTerm } })
    };


    const [visibleChannel, setVisibleChannel] = useState(false);
    const [channelTitle, setChannelTitle] = useState('');
    const [channelDescription, setChannelDescription] = useState('');
    const [channelImage, setChannelImage] = useState(null);

    const handleChannelSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', channelTitle);
            formData.append('description', channelDescription);
            if (channelImage) {
                formData.append('images', channelImage);
            }

            const response = await fetch('https://academics.newtonschool.co/api/v1/reddit/channel/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'projectID': 'j5fvhsc8nd79'
                },
                body: formData
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setVisibleChannel(false);
                Swal.fire({
                    icon: "success",
                    title: `Channel Added successfully`,
                });
                event.target.reset();
            } else {
                toast.error("Failed to create channel.");
            }
        } catch (error) {
            console.error('Failed to create channel:', error);
        }
    };

    const handleChannelTitleChange = (event) => {
        setChannelTitle(event.target.value);
    };

    const handleChannelDescriptionChange = (event) => {
        setChannelDescription(event.target.value);
    };

    const handleChannelImageChange = (event) => {
        setChannelImage(event.target.files[0]);
    };

    const handlePremium = () => {
        navigate('/subscription')
    };

    return (
        <div className='header lg:w-screen lg:h-20'>
            <img className='logo lg:h-14' src={logo} alt="Logo" />
            <img className='logoname lg:h-12' src={logoName} alt="Logo Name" />

            <button onClick={handlePremium}   className='premium-btn lg:w-24' >PREMIUM</button>

            <form className='search' onSubmit={handleSearch} >
                <SearchIcon className='searchicon lg:h-7'  />
                <input className='searchbox lg:w-64' type='text' value={searchTerm} onChange={handleSearchInputChange}    placeholder='Search reddit' />
                <Button className='btnsearch' type="submit">Search</Button>
            </form>

            {localStorage.getItem('token') ? (
                <React.Fragment>


                    <ChatIcon onClick={() => setVisibleChannel(true)} className='chatIcon lg:w-10'  />
                    <BellIcon className='bellIcon'  />
                    <PlusIcon onClick={() => setVisiblePost(true)} className='plusIcon' />

                    <img src={av} className='avtar lg:h-10' alt="av" />
                    <b className='user lg:text-xl lg:mr-10' >{localStorage.getItem('userName').toUpperCase()}</b>
                    <button onClick={handleLogout} className='logout lg:h-12 lg:w-20 lg:text-lg ' >Logout</button>

                    {/* for new post */}
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
                        <form onSubmit={handlePost}>
                            <h1 style={{ fontSize: "2rem", color: "orange" }}>Create New Post</h1>

                            <div>
                                <input type='text' name='title' min={3} max={50} placeholder='Title' required style={{ width: "30rem", marginTop: "1rem", padding: "5px", marginLeft: "2rem", border: "1px solid gray" }} />
                            </div>

                            <div>
                                <input type='text' name='description' min={10} max={1000} placeholder='Description' required style={{ width: "30rem", height: "10rem", marginTop: "2rem", padding: "5px", marginLeft: "2rem", border: "1px solid gray" }} />
                            </div>

                            <div>
                                <input type="file" accept="image/*" name="image" style={{ marginTop: "2rem", marginLeft: "2rem" }} />
                            </div>

                            <div style={{ marginTop: "2rem", marginLeft: "2rem" }}>
                                <button type="submit" style={{ marginRight: "1rem", padding: "5px 10px", backgroundColor: "orange", color: "white", border: "none", borderRadius: "5px" }}>Submit</button>
                                <button type="reset" style={{ padding: "5px 10px", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px" }}>Reset</button>
                            </div>
                        </form>
                    </Model>

                    {/* for new channel */}

                    <Model isOpen={visibleChannel} onRequestClose={() => setVisibleChannel(false)} style={{
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
                        <form onSubmit={handleChannelSubmit}>
                            <h1 style={{ fontSize: "2rem", color: "orange" }}>Create New Channel</h1>

                            <div>
                                <input type='text' name='title' value={channelTitle} onChange={handleChannelTitleChange} min={3} max={50} placeholder='Title' required style={{ width: "30rem", marginTop: "1rem", padding: "5px", marginLeft: "2rem", border: "1px solid gray" }} />
                            </div>

                            <div>
                                <input type='text' name='description' value={channelDescription} onChange={handleChannelDescriptionChange} min={10} max={1000} placeholder='Description' required style={{ width: "30rem", height: "10rem", marginTop: "2rem", padding: "5px", marginLeft: "2rem", border: "1px solid gray" }} />
                            </div>

                            <div>
                                <input type="file" accept="image/*" name="image" onChange={handleChannelImageChange} style={{ marginTop: "2rem", marginLeft: "2rem" }} />
                            </div>

                            <div style={{ marginTop: "2rem", marginLeft: "2rem" }}>
                                <button type="submit" style={{ marginRight: "1rem", padding: "5px 10px", backgroundColor: "orange", color: "white", border: "none", borderRadius: "5px" }}>Submit</button>
                                <button type="reset" style={{ padding: "5px 10px", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px" }}>Reset</button>
                            </div>
                        </form>
                    </Model>

                </React.Fragment>

            ) :
                (

                    <React.Fragment>


                        <div className='logindiv'>
                            <button onClick={() => setVisibleLogin(true)} className='login lg:ml-14 lg:h-12 lg:w-20 lg:text-lg ' >Login</button>
                            <button onClick={() => setVisibleSignup(true)} className='signup lg:h-12 lg:w-20 lg:text-lg ' >SignUp</button>
                        </div>

                        <Model isOpen={visibleLogin} onRequestClose={() => setVisibleLogin(false)} style={{
                            overlay: {
                                background: "rgba(0, 0, 0, 0.5)",
                            },
                            content: {
                                width: "500px",
                                height: "500px",
                                marginLeft: "25rem",
                                marginRight: "20rem",
                                marginTop: "1rem",
                                background: "black"
                            }
                        }}>
                            <form onSubmit={handleLogin}>
                                <h1 style={{ textAlign: "center", fontSize: "2rem", color: "orange" }}>LOGIN</h1>
                                <div style={{ marginTop: "3rem" }}>
                                    <label style={{ fontSize: "1.5rem", color: "white", marginRight: "3.7rem" }}>Email : </label>
                                    <input type='email' name='email' required style={{ padding: "4px", width: "15rem" }} />
                                </div>
                                <div style={{ marginTop: "3rem" }}>
                                    <label style={{ fontSize: "1.5rem", color: "white", marginRight: "1rem" }}>Password : </label>
                                    <input type='password' name='password' required style={{ padding: "4px", width: "15rem" }} />
                                </div>
                                <Button type='submit' style={{ border: "1px solid blue", marginTop: "3rem", marginLeft: "12rem", padding: "10px", fontSize: "1.5rem" }}>Login</Button>
                                <div style={{ marginTop: "3rem" }}>
                                    <label style={{ fontSize: "1.2rem", color: "white" }}>Haven't an account : </label>
                                    <b onClick={() => { setVisibleLogin(false); setVisibleSignup(true); }} style={{ color: "red", cursor: "pointer" }}>register here...</b>
                                </div>
                            </form>
                        </Model>

                        <Model isOpen={visibleSignup} onRequestClose={() => setVisibleSignup(false)} style={{
                            overlay: {
                                background: "rgba(0, 0, 0, 0.5)",
                            },
                            content: {
                                width: "500px",
                                height: "500px",
                                marginLeft: "25rem",
                                marginRight: "20rem",
                                marginTop: "1rem",
                                background: "black"
                            }
                        }}>
                            <form onSubmit={handleSignup}>
                                <h1 style={{ textAlign: "center", fontSize: "2rem", color: "orange" }}>SIGN UP</h1>
                                <div style={{ marginTop: "3rem" }}>
                                    <label style={{ fontSize: "1.5rem", color: "white" }}>UserName : </label>
                                    <input type='text' name='name' required style={{ padding: "4px", width: "15rem" }} />
                                </div>
                                <div style={{ marginTop: "3rem" }}>
                                    <label style={{ fontSize: "1.5rem", color: "white", marginRight: "3.7rem" }}>Email : </label>
                                    <input type='email' name='email' required style={{ padding: "4px", width: "15rem" }} />
                                </div>
                                <div style={{ marginTop: "3rem" }}>
                                    <label style={{ fontSize: "1.5rem", color: "white", marginRight: "1rem" }}>Password : </label>
                                    <input type='password' name='password' required style={{ padding: "4px", width: "15rem" }} />
                                </div>
                                <Button type='submit' style={{ border: "1px solid blue", marginTop: "3rem", marginLeft: "12rem", padding: "10px", fontSize: "1.5rem" }}>SignUp</Button>
                            </form>
                        </Model>
                    </React.Fragment>
                )}

        </div>
    );
};

export default Navbar;
