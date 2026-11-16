import { CalendarDays, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer=()=> {
    return (
        <footer className="bg-gray-950 text-gray-400 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <div className="flex flex-col md:flex-row justify-between gap-8">

                    <div>
                        <Link to="/" className="flex items-center gap-2 text-white">
                            <CalendarDays size={24} className="text-blue-400" />
                            <span className="text-xl font-bold">
                                AppointmentPro
                            </span>
                        </Link>

                        <p className="text-sm mt-3 max-w-sm leading-6">
                            Simple and efficient appointment management.
                            Keep your schedule organized and manage every
                            appointment in one place.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-white font-semibold">Quick Links</h3>

                        <Link to="/" className="text-sm hover:text-white">
                            Home
                        </Link>

                        <Link to="/appointments" className="text-sm hover:text-white">
                            All Appointments
                        </Link>

                        <Link to="/appointments/new" className="text-sm hover:text-white">
                            Add Appointment
                        </Link>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs">
                    <p>© {new Date().getFullYear()} AppointmentPro. All rights reserved.</p>

                    <p className="flex items-center gap-1">
                        Made with <Heart size={13} className="text-red-400" /> for better scheduling
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;