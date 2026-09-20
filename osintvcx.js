const fs = require('fs');
const readline = require('readline');
const https = require('https'); 

const inputTerminal = fs.createReadStream('/dev/tty');
const outputTerminal = fs.createWriteStream('/dev/tty');

const rl = readline.createInterface({
    input: inputTerminal,
    output: outputTerminal
});

let statusSekarang = 'MENU'; 

function cetak(teks) {
    outputTerminal.write(teks + '\n');
}

function bersihkanLayar() {
    outputTerminal.write('\x1Bc'); 
}

function tampilkanMenu() {
    statusSekarang = 'MENU';
    bersihkanLayar();
    cetak("\x1b[36m====================================================\x1b[0m");
    cetak("\x1b[36m               VCX TERMUX MULTI-TOOLS               \x1b[0m");
    cetak("\x1b[36m====================================================\x1b[0m");
    cetak(" Kalkulator Sederhana");
    cetak(" Auto Hitung Baris Custom (1 sampai N)");
    cetak(" 🔍 Tools OSINT (IP Lookup & Username Tracker)");
    cetak(" Keluar");
    cetak("----------------------------------------------------");
    cetak("\x1b[33m 💡 Command Global Kapan Saja:\x1b[0m");
    cetak("    \x1b[35m/vcxmenu\x1b[0m = Kembali ke menu utama");
    cetak("    \x1b[35m/ccl\x1b[0m     = Bersihkan teks di console");
    cetak("----------------------------------------------------");
    rl.setPrompt('\n🔑 Pilih nomor menu atau ketik command: ');
    rl.prompt();
}

function jalankanKalkulator() {
    statusSekarang = 'KALKULATOR';
    cetak("\n\x1b[32m=== [MENU 1] KALKULATOR ===\x1b[0m");
    cetak("Format pengisian: [angka1] [operator] [angka2]");
    cetak("Contoh: \x1b[33m10 + 5\x1b[0m  atau  \x1b[33m20 * 4\x1b[0m");
    rl.setPrompt('🧮 Masukkan perhitungan: ');
    rl.prompt();
}

function jalankanHitungBaris() {
    statusSekarang = 'HITUNG_BARIS';
    cetak("\n\x1b[32m=== [MENU 2] AUTO HITUNG BARIS ===\x1b[0m");
    rl.setPrompt('🔢 Mau hitung dari 1 sampai berapa? (Maks: 500000): ');
    rl.prompt();
}

function jalankanOsintMenu() {
    statusSekarang = 'OSINT_MENU';
    cetak("\n\x1b[35m=== [MENU 3] TOOLS OSINT ===\x1b[0m");
    cetak(" 🌐 IP Geolocation Lookup");
    cetak(" 👤 Username Target Tracker");
    cetak(" ⬅️ Kembali ke Menu Utama");
    rl.setPrompt('\n🔎 Pilih sub-menu OSINT: ');
    rl.prompt();
}

// Sub-OSINT IP Lookup menggunakan server ip-api.com (Lebih stabil)
function osintIpLookup(ip) {
    cetak(`\n⏳ Sedang melacak IP: ${ip || 'IP Kamu'}...`);
    
    // Jika kosong, server ip-api.com otomatis mendeteksi IP saat ini lewat endpoint /json
    const url = ip ? `https://ip-api.com{ip}` : `https://ip-api.com`;

    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const info = JSON.parse(data);
                if (info.status === "fail") {
                    cetak(`\x1b[31m❌ Gagal: ${info.message || 'IP tidak valid!'}\x1b[0m\n`);
                } else {
                    cetak("\n\x1b[32m=== 📊 HASIL PELACAKAN IP (BACKUP SERVER) ===\x1b[0m");
                    cetak(`📍 IP Target : ${info.query}`);
                    cetak(`🌍 Negara    : ${info.country} (${info.countryCode})`);
                    cetak(`🏙️ Kota      : ${info.city}, ${info.regionName}`);
                    cetak(`🏢 Provider  : ${info.isp} (${info.as})`);
                    cetak(`📮 Kode Pos  : ${info.zip || 'Tidak terdeteksi'}`);
                    cetak(`🗺️ Koordinat : Lat: ${info.lat}, Lon: ${info.lon}`);
                    cetak("============================================\n");
                }
            } catch (e) {
                cetak("\x1b[31m❌ Gagal memproses data dari server.\x1b[0m\n");
            }
            jalankanOsintMenu();
        });
    }).on('error', () => {
        cetak("\x1b[31m❌ Koneksi gagal! Periksa koneksi internet Termux kamu.\x1b[0m\n");
        jalankanOsintMenu();
    });
}

// Sub-OSINT Username Tracker (Daftar media sosial ditambah)
function osintUsernameTracker(username) {
    cetak(`\n⏳ Memindai username [ ${username} ] di berbagai platform...`);
    
    const sites = [
        { name: 'GitHub', url: `https://github.com{username}` },
        { name: 'Instagram', url: `https://instagram.com{username}/` },
        { name: 'TikTok', url: `https://tiktok.com{username}` },
        { name: 'Pinterest', url: `https://pinterest.com{username}/` },
        { name: 'Linktree', url: `https://linktr.ee{username}` }
    ];

    let selesai = 0;
    cetak("\n\x1b[32m=== 🔎 HASIL PEMINDAIAN ===\x1b[0m");

    sites.forEach((site) => {
        https.get(site.url, (res) => {
            // Status 200 atau 302/301 biasanya berarti profil tersebut ada
            if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
                cetak(`🟢 [ADA] ${site.name}: ${site.url}`);
            } else {
                cetak(`🔴 [TIDAK ADA] ${site.name}`);
            }
            selesai++;
            if (selesai === sites.length) {
                cetak("=============================\n");
                jalankanOsintMenu();
            }
        }).on('error', () => {
            cetak(`⚠️ [ERROR] Gagal mengecek ${site.name}`);
            selesai++;
            if (selesai === sites.length) {
                cetak("=============================\n");
                jalankanOsintMenu();
            }
        });
    });
}

rl.on('line', (line) => {
    const input = line.trim();

    if (input === '/ccl') {
        bersihkanLayar();
        if (statusSekarang === 'MENU') tampilkanMenu();
        else if (statusSekarang === 'OSINT_MENU') jalankanOsintMenu();
        else rl.prompt();
        return;
    }

    if (input === '/vcxmenu') {
        tampilkanMenu();
        return;
    }

    if (statusSekarang === 'MENU') {
        if (input === '1') jalankanKalkulator();
        else if (input === '2') jalankanHitungBaris();
        else if (input === '3') jalankanOsintMenu();
        else if (input === '4') {
            cetak("\n🙏 Terima kasih telah menggunakan VCX Tools. Sampai jumpa!");
            rl.close();
            process.exit(0);
        } else {
            cetak("\x1b[31m⚠️ Pilihan salah! Pilih 1-4.\x1b[0m");
            rl.prompt();
        }
    } 
    
    else if (statusSekarang === 'KALKULATOR') {
        const bagian = input.split(/\s+/);
        if (bagian.length !== 3) {
            cetak("\x1b[31m⚠️ Format salah! Contoh: 10 + 5\x1b[0m\n");
            rl.prompt(); return;
        }
        const a = parseFloat(bagian[0]); const op = bagian[1]; const b = parseFloat(bagian[2]);
        let hasil = 0;
        if (op === '+') hasil = a + b;
        else if (op === '-') hasil = a - b;
        else if (op === '*' || op === 'x') hasil = a * b;
        else if (op === '/') hasil = a / b;
        cetak(`\x1b[32m✅ Hasil: ${hasil}\x1b[0m\n`);
        rl.prompt();
    } 
    
    else if (statusSekarang === 'HITUNG_BARIS') {
        const target = parseInt(input);
        if (isNaN(target) || target < 1 || target > 500000) {
            cetak("\x1b[31m⚠️ Masukkan angka 1 - 500000!\x1b[0m\n");
            rl.prompt(); return;
        }
        for (let i = 1; i <= target; i++) cetak(i.toString());
        rl.prompt();
    } 
    
    else if (statusSekarang === 'OSINT_MENU') {
        if (input === '1') {
            statusSekarang = 'OSINT_IP';
            cetak("\n🌐 [IP LOOKUP] Masukkan alamat IP Target (atau kosongkan langsung Enter untuk cek IP kamu):");
            rl.setPrompt('🎯 IP Target: ');
            rl.prompt();
        } else if (input === '2') {
            statusSekarang = 'OSINT_USER';
            cetak("\n👤 [USERNAME TRACKER] Masukkan nama username target:");
            rl.setPrompt('🎯 Username: ');
            rl.prompt();
        } else if (input === '3') {
            tampilkanMenu();
        } else {
            cetak("\x1b[31m⚠️ Pilihan salah! Pilih 1-3.\x1b[0m");
            rl.prompt();
        }
    } 
    
    else if (statusSekarang === 'OSINT_IP') {
        osintIpLookup(input);
    } 
    
    else if (statusSekarang === 'OSINT_USER') {
        if (!input) {
            cetak("\x1b[31m⚠️ Username tidak boleh kosong!\x1b[0m");
            rl.prompt();
            return;
        }
        osintUsernameTracker(input);
    }
});

tampilkanMenu();
    
