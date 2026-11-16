import { ArrowLeft, CalendarX } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="bg-blue-50 text-blue-600 p-5 rounded-2xl mb-5">
                <CalendarX size={42} />
            </div>

            <h1 className="text-5xl font-bold text-gray-900">404</h1>

            <h2 className="text-xl font-semibold text-gray-800 mt-3">
                Page Not Found
            </h2>

            <p className="text-gray-500 text-sm mt-2">
                Sorry, the page you are looking for doesn't exist.
            </p>

            <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm"
            >
                <ArrowLeft size={17} />
                Back to Home
            </Link>
        </div>
    );
}

export default NotFound;