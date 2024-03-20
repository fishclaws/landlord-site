import { useEffect, useState } from "react";
import './App.scss';

function Header() {


    useEffect(() => {

    }, []);

    return (
        <div className="header">
           <button>Rate Your Landlord PDX</button>
           <button>Search</button>
           <button>Connect with your neighbors</button>
        </div>
    )
}


export default Header;
