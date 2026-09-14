import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import OnboardingGuide from "../guide/OnboardingGuide";
import { useGuide } from "../../context/GuideContext";
import "./layout.css";

function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { registerSidebarControls } = useGuide();

    // Daftarkan kontrol sidebar ke GuideContext saat komponen dimuat
    useEffect(() => {
        if (registerSidebarControls) {
            registerSidebarControls(setSidebarOpen);
        }
    }, [registerSidebarControls]);

    return (
        <div className="layout">
            <OnboardingGuide />

            <Sidebar
                isOpen={sidebarOpen}
                closeSidebar={() => setSidebarOpen(false)}
            />

            {sidebarOpen && (
                <div
                    className="overlay active"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="main">
                <Header
                    toggleSidebar={() => setSidebarOpen(true)}
                />
                <div className="content">
                    <Outlet />
                </div>
            </div>

        </div>
    );
}

export default AppLayout;