import axios from "axios";
import {
    AlertCircle,
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    Clock,
    Plus,
    User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../services/apis";

const initialForm = {
    customerName: "",
    service: "",
    dateTime: "",
    status: "Pending",
};

const  AddAppointmentPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setApiError("");
        setSuccess("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.customerName.trim()) {
            newErrors.customerName = "Customer name is required";
        } else if (form.customerName.trim().length < 2) {
            newErrors.customerName = "Name must contain at least 2 characters";
        } else if (form.customerName.trim().length > 100) {
            newErrors.customerName = "Name cannot exceed 100 characters";
        }

        if (!form.service.trim()) {
            newErrors.service = "Service is required";
        }

        if (!form.dateTime) {
            newErrors.dateTime = "Please select appointment date and time";
        } else if (
            Number.isNaN(new Date(form.dateTime).getTime())
        ) {
            newErrors.dateTime = "Please enter a valid date and time";
        }

        if (!["Pending", "Confirmed", "Cancelled"].includes(form.status)) {
            newErrors.status = "Please select a valid status";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setApiError("");
        setSuccess("");

        try {
            const payload = {
                customerName: form.customerName.trim(),
                service: form.service.trim(),
                dateTime: new Date(form.dateTime).toISOString(),
                status: form.status,
            };

            const res = await axios.post(`${API_URL}`, payload,{withCredentials: true});

            if(res.data?.success){
                setSuccess("Appointment created successfully!");
                setTimeout(() => {
                    navigate("/appointments", {
                        replace: true,
                        state: {
                            message: "New appointment created successfully!",
                        },
                    });
                }, 700);
            }

        } catch (error) {
            setApiError(
                error.response?.data?.message ||
                (error.response
                    ? "Unable to create appointment. Please try again."
                    : "Unable to connect to server. Please try again.")
            );

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full px-4 py-3 pl-11 border rounded-xl outline-none text-sm text-gray-800 transition focus:ring-2 focus:ring-blue-500 ${
            errors[field]
                ? "border-red-400 bg-red-50/30"
                : "border-gray-200 bg-white"
        }`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

            <Link
                to="/appointments"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6"
            >
                <ArrowLeft size={17} />
                Back to Appointments
            </Link>

            <div className="max-w-2xl mx-auto">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-blue-50 text-blue-600 w-14 h-14 rounded-2xl mb-4">
                        <CalendarDays size={28} />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Add Appointment
                    </h1>

                    <p className="text-sm text-gray-500 mt-2">
                        Enter the customer and appointment details below.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">

                    {apiError && (
                        <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                            <AlertCircle size={19} className="shrink-0" />
                            {apiError}
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
                            <CheckCircle2 size={19} />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">

                        {/* Customer Name */}
                        <div>
                            <label
                                htmlFor="customerName"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Customer Name <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="customerName"
                                    type="text"
                                    name="customerName"
                                    value={form.customerName}
                                    onChange={handleChange}
                                    placeholder="Enter customer name"
                                    maxLength={100}
                                    className={inputClass("customerName")}
                                    aria-invalid={!!errors.customerName}
                                    aria-describedby="customerName-error"
                                />
                            </div>

                            {errors.customerName && (
                                <p id="customerName-error" className="text-red-500 text-xs mt-2">
                                    {errors.customerName}
                                </p>
                            )}
                        </div>

                        {/* Service */}
                        <div>
                            <label
                                htmlFor="service"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Service <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <BriefcaseBusiness
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="service"
                                    type="text"
                                    name="service"
                                    value={form.service}
                                    onChange={handleChange}
                                    placeholder="e.g. Consultation, Follow-up, Review"
                                    className={inputClass("service")}
                                    aria-invalid={!!errors.service}
                                    aria-describedby="service-error"
                                />
                            </div>

                            {errors.service && (
                                <p id="service-error" className="text-red-500 text-xs mt-2">
                                    {errors.service}
                                </p>
                            )}
                        </div>

                        {/* Date Time */}
                        <div>
                            <label
                                htmlFor="dateTime"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Appointment Date & Time <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <Clock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />

                                <input
                                    id="dateTime"
                                    type="datetime-local"
                                    name="dateTime"
                                    value={form.dateTime}
                                    onChange={handleChange}
                                    className={inputClass("dateTime")}
                                    aria-invalid={!!errors.dateTime}
                                    aria-describedby="dateTime-error"
                                />
                            </div>

                            {errors.dateTime && (
                                <p id="dateTime-error" className="text-red-500 text-xs mt-2">
                                    {errors.dateTime}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Appointment Status <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <CheckCircle2
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />

                                <select
                                    id="status"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className={inputClass("status")}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            {errors.status && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-3">

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl py-3.5 font-semibold text-sm transition"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Create Appointment
                                    </>
                                )}
                            </button>

                            <Link
                                to="/appointments"
                                className="flex justify-center items-center px-6 py-3.5 border border-gray-300 hover:bg-gray-50 rounded-xl text-gray-700 font-semibold text-sm transition"
                            >
                                Cancel
                            </Link>
                        </div>

                        <p className="text-xs text-gray-400 text-center">
                            Fields marked with * are required.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddAppointmentPage;