import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
    const [activePage, setActivePage] = useState<String>("store")
    const location = useLocation()

    useEffect(() => {
        if (location?.pathname !== "/") {
            setActivePage(location?.pathname.split("/")[1])
        }
    }, [location])
    return (
        <>
            <div className="sidebar">
                <Link to="/" onClick={() => setActivePage("store")} className={`${activePage === "store" ? "active" : ""}`}>Store</Link>
                <Link to="/sku" onClick={() => setActivePage("sku")} className={`${activePage === "sku" ? "active" : ""}`}>SKU</Link>
                <Link to="/planning" onClick={() => setActivePage("planning")} className={`${activePage === "planning" ? "active" : ""}`}>Planning</Link>
                <Link to="/chart" onClick={() => setActivePage("chart")} className={`${activePage === "chart" ? "active" : ""}`}>Charts</Link>
            </div>
        </>
    )
}

export default Sidebar
