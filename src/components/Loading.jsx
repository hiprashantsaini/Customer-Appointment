import { LoaderCircle } from "lucide-react";

export default function Loading({ text = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
            <LoaderCircle className="animate-spin text-blue-600" size={32} />
            <p className="text-sm text-gray-500">{text}</p>
        </div>
    );
}