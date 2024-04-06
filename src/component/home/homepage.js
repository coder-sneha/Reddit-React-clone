import React from 'react';
import Navbar from './navbar';
import Banner from './banner';


const HomePage = () => {


  return (
    <div className='background lg:w-screen' style={{background:"rgb(130, 130, 130)"}}>
      <Navbar /> 
      <Banner />

    </div >
  );
};

export default HomePage;
