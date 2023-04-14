import React from 'react'
import { StoreProvider } from '../context'
import Navbar from './Navbar'

const Footer = () => (
    <footer className="bg-gray-800">
        <div className="tw-container text-center py-6 text-sm md:text-base text-white tracking-widest">© 2023 Fmss Inc. All rights reserved</div>
    </footer>
)

function Content({ children }) {


    return (
        <>
            <Navbar/>
            <main>
                {children}
            </main>
            <Footer/>
        </>
    );
}

export default function AppProvider(props){
    return(

            <StoreProvider>
                <Content {...props}/>
            </StoreProvider>

    );
}