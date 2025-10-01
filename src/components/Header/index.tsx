import { Link } from "react-router-dom";

const Header = () => {
  return <div>
    header
    
    <Link to="/" >Home</Link>
    <Link to="/token" >Token</Link>
  </div>
}

export default Header;