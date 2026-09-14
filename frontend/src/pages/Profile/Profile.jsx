import { useState, useEffect } from "react";
import api from "../../services/Api";
import { toast } from "react-toastify";
import "./profile.css";

function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        business_name: "",
        avatar_url: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/users/profile");
            if (response.data.success) {
                setProfile(response.data.data);
            }
        } catch (error) {
            console.error("Gagal mengambil profil:", error);
            toast.error("Gagal memuat profil");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await api.put("/users/profile", {
                name: profile.name,
                phone: profile.phone,
                business_name: profile.business_name
            });
            if (response.data.success) {
                toast.success("Profil berhasil diperbarui");
            }
        } catch (error) {
            console.error("Gagal update profil:", error);
            toast.error("Gagal memperbarui profil");
        } finally {
            setSaving(false);
        }
    };

    // Fungsi unggah foto dari perangkat
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi ukuran file (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Ukuran file terlalu besar (maks 2MB)");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        setSaving(true);
        try {
            const response = await api.put("/users/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.success) {
                setProfile(prev => ({ ...prev, avatar_url: response.data.avatar_url }));
                toast.success("Foto profil berhasil diperbarui");
            }
        } catch (error) {
            console.error("Gagal upload foto:", error);
            toast.error(error.response?.data?.message || "Gagal mengunggah foto");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="profile-container">Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Profil Pengguna</h2>
                <p>Kelola informasi diri dan usaha Anda</p>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="avatar-section">
                        <div className="avatar-wrapper">
                            <img 
                                src={profile.avatar_url ? profile.avatar_url : "https://ui-avatars.com/api/?name=" + profile.name} 
                                alt="Profile" 
                                className="profile-avatar"
                            />
                            <input 
                                type="file" 
                                id="avatar-input" 
                                hidden 
                                accept="image/*" 
                                onChange={handleAvatarChange} 
                            />
                            <button 
                                className="change-avatar-btn" 
                                onClick={() => document.getElementById('avatar-input').click()}
                                type="button"
                            >
                                <i className="fas fa-camera"></i>
                            </button>
                        </div>
                        <h3>{profile.name}</h3>
                        <p className="user-role">Pemilik Usaha (Owner)</p>
                    </div>

                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email (Akun Google)</label>
                            <input type="email" value={profile.email} disabled className="disabled-input" />
                            <small>Email tidak dapat diubah karena terhubung dengan akun login.</small>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nama Lengkap Pemilik</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={profile.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Nomor Telepon</label>
                                <input 
                                    type="text" 
                                    name="phone" 
                                    value={profile.phone || ""} 
                                    onChange={handleChange} 
                                    placeholder="Contoh: 08123456789"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nama Usaha / Bisnis</label>
                            <input 
                                type="text" 
                                name="business_name" 
                                value={profile.business_name} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="profile-actions">
                            <button type="submit" className="save-profile-btn" disabled={saving}>
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="profile-info-card">
                    <h4>Informasi Akun</h4>
                    <div className="info-item">
                        <span className="info-label">Status Akun:</span>
                        <span className="info-value badge-active">Aktif</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">ID Bisnis:</span>
                        <span className="info-value">#PKM-{profile.tenant_id}</span>
                    </div>
                    <hr />
                    <div className="google-sync-info">
                        <i className="fab fa-google"></i>
                        <p>Akun ini siap dihubungkan dengan Google Login untuk sinkronisasi otomatis.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
