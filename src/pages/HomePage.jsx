import axios from "axios";
import {
    AlertCircle,
    ArrowRight,
    CalendarCheck,
    CalendarDays,
    CheckCircle2,
    Plus,
    RefreshCw,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../services/apis";
import AppointmentStatus from "../components/AppointmentStatus";
import Loading from "../components/Loading";


const HomePage=()=> {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        let isCurrentRequest = true;

        axios.get(`${API_URL}`).then((response) => {
            if (isCurrentRequest) {
                setAppointments(response.data.appointments || []);
            }
        }).catch((err) => {
            if (isCurrentRequest) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load appointments. Please try again."
                );
            }
        }).finally(() => {
            if (isCurrentRequest) {
                setLoading(false);
            }
        });

        return () => {
            isCurrentRequest = false;
        };
    }, [refreshKey]);

    const handleRetry = () => {
        setLoading(true);
        setError("");
        setRefreshKey((previous) => previous + 1);
    };

    const stats = [
        { label: "Total Appointments", value: appointments.length, icon: CalendarDays },
        {
            label: "Confirmed",
            value: appointments.filter((appointment) => appointment.status === "Confirmed").length,
            icon: CheckCircle2,
        },
        {
            label: "Customers",
            value: new Set(appointments.map((appointment) => appointment.customerName)).size,
            icon: Users,
        },
    ];

    return (
        <div>
            {/* Hero */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
                                <CalendarCheck size={15} />
                                SIMPLE APPOINTMENT MANAGEMENT
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Manage Your
                                <span className="text-blue-600"> Appointments </span>
                                With Ease
                            </h1>

                            <p className="text-gray-500 text-base sm:text-lg leading-8 mt-6 max-w-lg">
                                Organize your schedule, manage customer
                                appointments and track booking status
                                from one simple dashboard.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 mt-8">

                                <Link
                                    to="/appointments"
                                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-blue-600/20"
                                >
                                    View Appointments
                                    <ArrowRight size={18} />
                                </Link>

                                <Link
                                    to="/appointments/new"
                                    className="flex items-center justify-center gap-2 border border-gray-300 hover:border-blue-600 hover:text-blue-600 text-gray-700 px-6 py-3.5 rounded-xl font-semibold transition"
                                >
                                    <Plus size={19} />
                                    Manage Appointments
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-5 mt-8 text-sm text-gray-500">
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 size={17} className="text-green-500" />
                                    Easy scheduling
                                </span>

                                <span className="flex items-center gap-2">
                                    <CheckCircle2 size={17} className="text-green-500" />
                                    Real-time updates
                                </span>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-blue-100 rounded-3xl rotate-3" />

                            <img
                                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
                                alt="Modern professional office workspace"
                                className="relative w-full h-[300px] sm:h-[420px] object-cover rounded-3xl shadow-xl"
                            />

                            <div className="absolute -bottom-5 -left-2 sm:-left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                                <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                                    <CalendarCheck size={24} />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Appointment status
                                    </p>
                                    <p className="font-bold text-gray-900">
                                        Everything organized!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {stats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm"
                            >
                                <div className="bg-blue-50 text-blue-600 p-4 rounded-xl">
                                    <Icon size={25} />
                                </div>

                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {item.value}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Recent appointments */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Recent Appointments
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Preview of your appointment schedule
                        </p>
                    </div>

                    <Link
                        to="/appointments"
                        className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    {loading ? (
                        <Loading text="Loading recent appointments..." />
                    ) : error ? (
                        <div className="px-5 py-12 text-center">
                            <AlertCircle className="text-red-500 mx-auto mb-2" size={28} />
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={handleRetry}
                                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-700 underline"
                            >
                                <RefreshCw size={15} />
                                Try Again
                            </button>
                        </div>
                    ) : appointments.length === 0 ? (
                        <p className="px-5 py-12 text-center text-sm text-gray-500">
                            No appointments yet.
                        </p>
                    ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[650px]">
                            <thead className="bg-[#254b68] text-white">
                                <tr>
                                    {["Customer", "Service", "Date / time", "Status"].map((heading) => (
                                        <th key={heading} className="px-5 py-4 text-sm font-semibold">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {appointments.slice(0, 3).map((appointment) => (
                                    <tr key={appointment._id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-medium text-gray-900">
                                            {appointment.customerName}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {appointment.service}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                            {new Date(appointment.dateTime).toLocaleString("en-IN", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                            })}
                                        </td>

                                        <td className="px-5 py-4">
                                            <AppointmentStatus status={appointment.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    )}

                    <div className="p-4 border-t border-gray-100 text-center">
                        <Link
                            to="/appointments"
                            className="text-sm text-blue-600 font-semibold hover:underline"
                        >
                            Explore all appointments →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;