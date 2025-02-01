import { Link } from "react-router";

const Navbar: React.FC = () => {
  return (
    <nav className="p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black text-lg font-bold">Stripe</div>
        <div className="space-x-4">
          <Link to="/">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Checkout
            </button>
          </Link>
          <Link to="/status">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Status
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
