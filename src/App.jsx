import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";

import AddAppointmentPage from "./pages/AddAppointmentPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />

                    <Route
                        path="/appointments"
                        element={<AppointmentsPage />}
                    />

                    <Route
                        path="/appointments/new"
                        element={<AddAppointmentPage />}
                    />

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}