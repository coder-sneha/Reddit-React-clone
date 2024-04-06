import React from 'react';
import Navbar from './navbar';
import premium from '../home/reddit-premium-page.jpg'



const Subcription = () => {

 

  return (
    <div>
    
    <Navbar />
    <img className='premium sm:w-screen' src={premium} />
        
   
    </div>
  );
};

export default Subcription;
