import { CalendarDays, Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const navClass = ({ isActive }) =>
        `text-sm font-medium transition-colors ${
            isActive
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">

                    <Link
                        to="/"
                        className="flex items-center gap-2.5"
                        onClick={() => setMenuOpen(false)}
                    >
                        <div className="bg-blue-600 text-white p-2 rounded-xl">
                            <CalendarDays size={23} />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">
                                Appointment<span className="text-blue-600">Pro</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 tracking-wider">
                                APPOINTMENT MANAGER
                            </p>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <NavLink to="/" className={navClass}>
                            Home
                        </NavLink>

                        <NavLink to="/appointments" className={navClass}>
                            Appointments
                        </NavLink>
                    </nav>

                    <div className="hidden md:block">
                        <Link
                            to="/appointments/new"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
                        >
                            <Plus size={17} />
                            Add Appointment
                        </Link>
                    </div>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        aria-label="Toggle navigation"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {menuOpen && (
                    <nav className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-4">
                        <NavLink
                            to="/"
                            onClick={() => setMenuOpen(false)}
                            className={navClass}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/appointments"
                            onClick={() => setMenuOpen(false)}
                            className={navClass}
                        >
                            Appointments
                        </NavLink>

                        <Link
                            to="/appointments/new"
                            onClick={() => setMenuOpen(false)}
                            className="bg-blue-600 text-white rounded-lg py-2.5 px-4 text-center font-medium text-sm"
                        >
                            + Add Appointment
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}

export default Header;