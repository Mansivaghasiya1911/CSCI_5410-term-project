import React, { useState } from 'react';
import 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Box, Button, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Link as ChakraLink, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';


const Dashboard = () => {
    

    return (
        <>
            <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <h1 className='h2'>Dashboard</h1>
                  </div>
                  <div className="col-md-6"></div>
                  <div className="col-md-6"></div>
                  </div>
            </div>
        </>
    );
};

export default Dashboard;