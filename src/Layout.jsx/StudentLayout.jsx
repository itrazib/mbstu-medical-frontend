import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';

const StudentLayout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
          <div>  <Navbar></Navbar></div>
           <div className='flex-1'> <Outlet></Outlet></div>
           <div> <Footer></Footer></div>
        </div>
    );
};

export default StudentLayout;