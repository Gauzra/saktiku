const bcrypt = require('bcrypt');

async function test() {
    const inputPassword = 'password123';
    const storedHash = '$2b$10$fhGxDbJy2ESr..g0g0bsAuUsVMR1RkQLwMqgpIyosD6.BSDTjlZEa';

    const match = await bcrypt.compare(inputPassword, storedHash);
    console.log('Match?', match);

    // Buat hash baru untuk password123
    const newHash = await bcrypt.hash('password123', 10);
    console.log('New hash for password123:', newHash);
}

test();