const styles = {
    Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Confirmed: "bg-green-50 text-green-700 ring-green-600/20",
    Cancelled: "bg-red-50 text-red-700 ring-red-600/20",
};

export default function AppointmentStatus({ status }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${
                styles[status] || "bg-gray-100 text-gray-600 ring-gray-300"
            }`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}