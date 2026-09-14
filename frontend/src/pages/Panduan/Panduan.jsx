import { useNavigate } from "react-router-dom";
import "./Panduan.css";

function Panduan() {
    const navigate = useNavigate();

    return (
        <div className="panduan-page">
            <div className="panduan-header">
                <button 
                    className="panduan-back-btn" 
                    onClick={() => navigate(-1)}
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>Kembali</span>
                </button>
                <h1>Panduan Penggunaan</h1>
            </div>
            
            <div className="panduan-content">
                <iframe 
                    src="/panduan/GUIDEBOOK SAKTIKU 2026.pdf" 
                    title="Panduan Penggunaan"
                    className="panduan-iframe"
                />
            </div>
        </div>
    );
}

export default Panduan;
