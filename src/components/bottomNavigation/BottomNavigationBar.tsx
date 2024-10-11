import { Home, Plus, Search, User } from "lucide-react"
import { NavLink } from "react-router-dom";

export default function BottomNavigation() {
    return (
        <nav className="h-24 bg-sky-900 p-8">
            <div className="max-w-md mx-auto flex justify-between items-center space-x-8 h-full">
                <NavLink
                    to="/"
                    className={({isActive}) => isActive ? "text-yellow-500" : "text-white"}>
                    <Home size={24}/>
                </NavLink>
                <NavLink
                    to="/search"
                    className={({isActive}) => isActive ? "text-yellow-500" : "text-white"}>
                    <Search size={24}/>
                </NavLink>
                <NavLink
                    to="/add"
                    className={({isActive}) =>
                        isActive ? "text-yellow-500" : "text-white"
                    }
                >
                    <Plus size={24}/>
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({isActive}) =>
                        isActive ? "text-yellow-500" : "text-white"
                    }
                >
                    <User size={24}/>
                </NavLink>
            </div>
        </nav>
    );
}