import React from 'react'
import './Navbar.css'
import { Dropdown, Image } from 'react-bootstrap'
import { FaUserCircle } from 'react-icons/fa';
import mainLogo from "../../assets/logos/Gsynergy Logo V2 Long Description.svg"
const UserIcon = FaUserCircle as unknown as React.FC<{ size?: number }>;

const Navbar = () => {
    return (
        <div className='d-flex justify-content-between align-items-center p-3 bg-white '>
            <Image src={mainLogo} className='img-fluid' width={"150px"}></Image>
            <h3>Data Viewer App</h3>
            <Dropdown>
                <Dropdown.Toggle variant="light" id="user-dropdown" className="d-flex align-items-center border-0">
                    <UserIcon size={24} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
                    <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default Navbar
