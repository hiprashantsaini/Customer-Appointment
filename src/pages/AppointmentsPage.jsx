import axios from "axios";
import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    Clock,
    Plus,
    RefreshCw,
    Search,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { API_URL } from "../../services/apis";
import AppointmentStatus from "../components/AppointmentStatus";
import Loading from "../components/Loading";

const filters = ["All", "Pending", "Confirmed", "Cancelled"];

const statusOptions = ["Pending", "Confirmed", "Cancelled"];

const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

function ErrorMessage({ message, onRetry }) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <AlertCircle className="text-red-500 mx-auto mb-2" size={28} />

            <p className="text-red-700 font-medium">{message}</p>

            <button
                onClick={onRetry}
                className="mt-3 text-sm font-semibold text-red-700 underline"
            >
                Try Again
            </button>
        </div>
    );
}

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [search, setSearch] = useState("");


    useEffect(() => {
        let isCurrentRequest = true;

        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${API_URL}`, {
                    params: activeFilter === "All" ? {} : { status: activeFilter },
                });

                if (response.data && isCurrentRequest) {
                    setAppointments(response.data.appointments || []);
                }
            } catch (err) {
                if (isCurrentRequest) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load appointments. Please try again."
                    );
                }
            } finally {
                if (isCurrentRequest) {
                    setLoading(false);
                }
            }
        };

        fetchAppointments();

        return () => {
            isCurrentRequest = false;
        };
    }, [activeFilter, refreshKey]);

    const handleRefresh = () => {
        setLoading(true);
        setError("");
        setRefreshKey((previous) => previous + 1);
    };

    const handleStatusChange = async (appointment, newStatus) => {
        if (appointment.status === newStatus) return;

        const confirmed = window.confirm(
            `Are you sure you want to change ${appointment.customerName}'s appointment status from ${appointment.status} to ${newStatus}?`
        );

        if (!confirmed) return;

        setUpdatingId(appointment._id);
        setNotice("");
        setError("");

        try {
            const response = await axios.patch(
                `${API_URL}/${appointment._id}/status`,
                { status: newStatus }
            );

            if(response.data ) {
            setAppointments((previous) =>
                previous
                    .map((item) =>
                        item._id === appointment._id
                            ? response.data.appointment
                            : item
                    )
                    // Remove appointment if it no longer matches the active filter
                    .filter((item) =>
                        activeFilter === "All" ||
                        item.status === activeFilter
                    )
            );

            setNotice(
                `${appointment.customerName}'s appointment status updated to ${newStatus}.`
            );
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update appointment status. Please try again."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredAppointments = appointments.filter((appointment) => {
        const searchText = search.toLowerCase();

        return (
            appointment.customerName.toLowerCase().includes(searchText) ||
            appointment.service.toLowerCase().includes(searchText)
        );
    });

    const counts = {
        All: appointments.length,
        Pending: appointments.filter((a) => a.status === "Pending").length,
        Confirmed: appointments.filter((a) => a.status === "Confirmed").length,
        Cancelled: appointments.filter((a) => a.status === "Cancelled").length,
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

            {/* Page Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">

                <div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-3"
                    >
                        <ArrowLeft size={15} />
                        Back to Home
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Appointments
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm">
                        View and manage all your customer appointments.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <Link
                        to="/appointments/new"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition"
                    >
                        <Plus size={18} />
                        Add New
                    </Link>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
                {[
                    { label: "Total", value: counts.All, icon: CalendarDays },
                    { label: "Pending", value: counts.Pending, icon: Clock },
                    { label: "Confirmed", value: counts.Confirmed, icon: Users },
                    { label: "Cancelled", value: counts.Cancelled, icon: AlertCircle },
                ].map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    {item.label}
                                </p>

                                <Icon size={19} className="text-blue-500" />
                            </div>

                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {item.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-5">

                <div className="flex flex-col lg:flex-row justify-between gap-4">

                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => {
                                    setActiveFilter(filter);
                                    setLoading(true);
                                    setError("");
                                    setNotice("");
                                    setRefreshKey((previous) => previous + 1);
                                }}
                                className={`whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-semibold transition ${activeFilter === filter
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:max-w-xs">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search customer or service..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            {notice && (
                <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <span>✓</span>
                    {notice}
                    <button
                        onClick={() => setNotice("")}
                        className="ml-auto font-bold"
                        aria-label="Dismiss notification"
                    >
                        ×
                    </button>
                </div>
            )}

            {error && (
                <div className="mb-5">
                    <ErrorMessage
                        message={error}
                        onRetry={handleRefresh}
                    />
                </div>
            )}

            {/* Appointment List */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="px-5 py-5 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-gray-900">
                            {activeFilter} Appointments
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            {filteredAppointments.length} appointments found
                        </p>
                    </div>
                </div>

                {loading ? (
                    <Loading text="Loading appointments..." />
                ) : !error && filteredAppointments.length === 0 ? (

                    <div className="text-center py-16 px-4">
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarDays size={28} className="text-blue-600" />
                        </div>

                        <h3 className="font-bold text-gray-900 text-lg">
                            No appointments found
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            {search
                                ? "Try searching with another customer name or service."
                                : "There are no appointments in this category yet."}
                        </p>

                        {!search && (
                            <Link
                                to="/appointments/new"
                                className="inline-flex items-center gap-2 mt-5 text-blue-600 font-semibold text-sm"
                            >
                                <Plus size={17} />
                                Create Appointment
                            </Link>
                        )}
                    </div>

                ) : !error && (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#254b68] text-white">
                                    <tr>
                                        <th className="px-5 py-4 text-sm font-semibold">
                                            Customer
                                        </th>

                                        <th className="px-5 py-4 text-sm font-semibold">
                                            Service
                                        </th>

                                        <th className="px-5 py-4 text-sm font-semibold">
                                            Date / time
                                        </th>

                                        <th className="px-5 py-4 text-sm font-semibold">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-sm font-semibold">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {filteredAppointments.map((appointment) => (
                                        <tr
                                            key={appointment._id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-5 py-4 font-medium text-gray-900">
                                                {appointment.customerName}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {appointment.service}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                                {formatDate(appointment.dateTime)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <AppointmentStatus
                                                    status={appointment.status}
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <select
                                                    value={appointment.status}
                                                    disabled={updatingId === appointment._id}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            appointment,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                                    aria-label={`Change status for ${appointment.customerName}`}
                                                >
                                                    {statusOptions.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                                {updatingId === appointment._id && (
                                                    <RefreshCw
                                                        size={15}
                                                        className="inline-block ml-2 animate-spin text-blue-600"
                                                        aria-label="Updating status"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {filteredAppointments.map((appointment) => (
                                <div
                                    key={appointment._id}
                                    className="p-4 space-y-4"
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {appointment.customerName}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {appointment.service}
                                            </p>
                                        </div>

                                        <AppointmentStatus
                                            status={appointment.status}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <CalendarDays size={16} className="text-blue-500" />
                                        {formatDate(appointment.dateTime)}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`status-${appointment._id}`}
                                            className="block text-xs font-semibold text-gray-500 mb-2"
                                        >
                                            CHANGE APPOINTMENT STATUS
                                        </label>

                                        <select
                                            id={`status-${appointment._id}`}
                                            value={appointment.status}
                                            disabled={updatingId === appointment._id}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    appointment,
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                        {updatingId === appointment._id && (
                                            <p className="mt-2 text-xs text-blue-600" role="status">
                                                Updating status...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AppointmentsPage;