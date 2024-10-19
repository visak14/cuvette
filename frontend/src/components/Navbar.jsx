import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import cuvettt from '../assets/image 650 1.png';
import UserDropdown from './UserDropdown'; // Import the UserDropdown component

const Navbar = () => {
    const { state } = useAuth();
    const location = useLocation();

    // Check if we are on the home/login page
    const isHomePage = location.pathname === '/';

    return (
        <nav className="p-4 border-b-2 sticky top-0 z-50 bg-white border-gray-300">
            <ul className="flex space-x-10 end-0">
                <div className='flex justify-between items-center w-full px-4'>
                    {/* Left div */}
                    <div className="">
                        <img src={cuvettt} alt="image description" className="w-[165px] h-[43px]" />
                    </div>

                    {/* Right div */}
                    <div className="flex items-center   space-x-4">
                        {!isHomePage && state.isAuthenticated && (
                            <>
                                {/* Use the dropdown component to show the email and logout */}
                                <UserDropdown
                                    email={state.email}
                                    name={state.email} // Replace with actual user name if available
                                    isAuthenticated={state.isAuthenticated}
                                />
                            </>
                        )}
                        {isHomePage && (
                            <p className="font-dm-sans text-[28px] text-[#576474] font-medium leading-[36.46px] text-left">Contact</p>
                        )}
                    </div>
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
