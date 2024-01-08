import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = ({ setKeyword, setAvailableOnly, availableOnly, listings, setCategory }) => {
        
    const handleLogoClick = () => {
        window.location.reload();
      };

      const onChange = (value, isCategory) => {
        if (isCategory) {
            console.log(value);
          setCategory(value);
        } else {
          setKeyword(value);
        }
      };

      const handleAvailabilityChange = (e) => {
        setAvailableOnly(e.target.checked);
        
      };
    
    const uniqueCategories = Array.from(new Set(listings.map(item => item.category)));
    

    return (
        <div className="nav-wrapper">
          <div className="grad-bar"></div>
          <nav className="navbar">
          <Link to="/" className='home-button' onClick={handleLogoClick}>
                <Link to="/" >
                <img src="/toolshareicon.png" alt="Logo of hands holding a hammer" />
                </Link>
            </Link>
            <Link to="/" onClick={handleLogoClick} className="nav-p">
                <Link to="/" >
                <p className="nav-p">ToolShare</p>
                </Link>
            </Link>
            <div className='nav-search-category-div'>
                <label>
                <input
                    className="nav-availability-checkbox"
                    type="checkbox"
                    checked={availableOnly}
                    onChange={handleAvailabilityChange}
                    />
                    Show available only
                </label>
              <input
                className="nav-search-bar"
                key="search-bar"
                placeholder={"Search..."}
                onChange={(e) => onChange(e.target.value, false)}
              />
              <select
                className="nav-select"
                onChange={(event) => onChange(event.target.value, true)}
              >
                <option value="">All categories</option>
                {uniqueCategories.map((category) => ( category === undefined ? "   " :
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <ul>
              <Link to="/" onClick={handleLogoClick} className="home-button">
                <p className="home-button">Home</p>
              </Link>
              <li className='about-button'> <Link to="/about">About</Link></li>
              <li><Link to="/chat">Chat</Link></li>
              <li className='createlisting-button'><Link to="/createlisting">Create Listing</Link></li>
              <li className='login-button'><Link to="/login">Login</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </nav>
        </div>
    );
}

export default Navbar