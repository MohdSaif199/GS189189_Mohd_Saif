import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
    const [activePage, setActivePage] = useState<String>("store")
    return (
        <>
            <div className="sidebar">
                <Link to="/" onClick={() => setActivePage("store")} className={`${activePage === "store" ? "active" : ""}`}>Store</Link>
                <Link to="/page2" onClick={() => setActivePage("sku")} className={`${activePage === "sku" ? "active" : ""}`}>SKU</Link>
                <Link to="/page3" onClick={() => setActivePage("planning")} className={`${activePage === "planning" ? "active" : ""}`}>Planning</Link>
                <Link to="/page4" onClick={() => setActivePage("charts")} className={`${activePage === "charts" ? "active" : ""}`}>Charts</Link>
            </div>
        </>
    )
}

export default Sidebar
