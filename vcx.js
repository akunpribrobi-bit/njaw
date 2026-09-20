const fs = require('fs');
const readline = require('readline');

// Buka terminal secara langsung untuk input/output stream curl
const inputTerminal = fs.createReadStream('/dev/tty');
const outputTerminal = fs.createWriteStream('/dev/tty');

const rl = readline.createInterface({
    input: inputTerminal,
    output: outputTerminal
});

// Status menu aktif: 'MENU', 'KALKULATOR', 'HITUNG_BARIS'
let statusSekarang = 'MENU'; 

// Fungsi pembantu untuk mencetak teks ke terminal
function cetak(teks) {
    outputTerminal.write(teks + '\n');
}

// Fungsi membersihkan layar console (/ccl)
function bersihkanLayar() {
    outputTerminal.write('\x1Bc'); 
}

// Fungsi memunculkan Dashboard Utama (/vcxmenu)
function tampilkanMenu() {
    statusSekarang = 'MENU';
    bersihkanLayar();
    cetak("\x1b[36m====================================================\x1b[0m");
    cetak("\x1b[36m               VCX TERMUX MULTI-TOOLS               \x1b[0m");
    cetak("\x1b[36m====================================================\x1b[0m");
    cetak(" [1] Kalkulator Sederhana");
    cetak(" [2] Auto Hitung Baris Custom (1 sampai N)");
    cetak(" [3] Keluar");
    cetak("----------------------------------------------------");
    cetak("\x1b[33m 💡 Command Global Kapan Saja:\x1b[0m");
    cetak("    \x1b[35m/vcxmenu\x1b[0m = Kembali ke menu utama");
    cetak("    \x1b[35m/ccl\x1b[0m     = Bersihkan teks di console");
    cetak("----------------------------------------------------");
    rl.setPrompt('\n🔑 Pilih nomor menu atau ketik command: ');
    rl.prompt();
}

// Sub-fitur 1: Jalankan Kalkulator
function jalankanKalkulator() {
    statusSekarang = 'KALKULATOR';
    cetak("\n\x1b[32m=== [MENU 1] KALKULATOR ===\x1b[0m");
    cetak("Format pengisian: [angka1] [operator] [angka2]");
    cetak("Contoh: \x1b[33m10 + 5\x1b[0m  atau  \x1b[33m20 * 4\x1b[0m  atau  \x1b[33m50 / 2\x1b[0m");
    rl.setPrompt('🧮 Masukkan perhitungan: ');
    rl.prompt();
}

// Sub-fitur 2: Jalankan Hitung Baris
function jalankanHitungBaris() {
    statusSekarang = 'HITUNG_BARIS';
    cetak("\n\x1b[32m=== [MENU 2] AUTO HITUNG BARIS ===\x1b[0m");
    rl.setPrompt('🔢 Mau hitung dari 1 sampai berapa? (Maks: 500000): ');
    rl.prompt();
}

// Handler utama untuk membaca semua jenis input pengguna
rl.on('line', (line) => {
    const input = line.trim();

    // 1. CEK GLOBAL COMMAND FIRST (Bisa dieksekusi di posisi status mana saja)
    if (input === '/ccl') {
        bersihkanLayar();
        if (statusSekarang === 'MENU') tampilkanMenu();
        else if (statusSekarang === 'KALKULATOR') jalankanKalkulator();
        else if (statusSekarang === 'HITUNG_BARIS') jalankanHitungBaris();
        return;
    }

    if (input === '/vcxmenu') {
        tampilkanMenu();
        return;
    }

    // 2. PROSES INPUT BERDASARKAN STATUS SEKARANG
    if (statusSekarang === 'MENU') {
        if (input === '1') {
            jalankanKalkulator();
        } else if (input === '2') {
            jalankanHitungBaris();
        } else if (input === '3') {
            cetak("\n🙏 Terima kasih telah menggunakan VCX Tools. Sampai jumpa!");
            rl.close();
            process.exit(0);
        } else {
            cetak("\x1b[31m⚠️ Menu tidak valid! Pilih angka 1-3 atau ketik command.\x1b[0m");
            rl.prompt();
        }
    } 
    
    else if (statusSekarang === 'KALKULATOR') {
        // Memisahkan input berdasarkan spasi (misal: "10 + 5")
        const bagian = input.split(/\s+/);
        if (bagian.length !== 3) {
            cetak("\x1b[31m⚠️ Format salah! Gunakan spasi, contoh: 10 + 5\x1b[0m\n");
            rl.prompt();
            return;
        }

        const a = parseFloat(bagian[0]);
        const op = bagian[1];
        const b = parseFloat(bagian[2]);

        if (isNaN(a) || isNaN(b)) {
            cetak("\x1b[31m⚠️ Angka yang kamu masukkan tidak valid!\x1b[0m\n");
            rl.prompt();
            return;
        }

        let hasil = 0;
        switch (op) {
            case '+': hasil = a + b; break;
            case '-': hasil = a - b; break;
            case '*': 
            case 'x': hasil = a * b; break;
            case '/': 
                if (b === 0) {
                    cetak("\x1b[31m⚠️ Error: Tidak bisa membagi angka dengan 0!\x1b[0m\n");
                    rl.prompt();
                    return;
                }
                hasil = a / b; 
                break;
            default:
                cetak("\x1b[31m⚠️ Operator tidak dikenal! Gunakan (+, -, *, /)\x1b[0m\n");
                rl.prompt();
                return;
        }

        cetak(`\x1b[32m✅ Hasil: ${a} ${op} ${b} = ${hasil}\x1b[0m\n`);
        cetak("💡 Ketik hitungan lagi, atau ketik \x1b[35m/vcxmenu\x1b[0m untuk kembali.");
        rl.prompt();
    } 
    
    else if (statusSekarang === 'HITUNG_BARIS') {
        const target = parseInt(input);

        if (isNaN(target) || target < 1 || target > 500000) {
            cetak("\x1b[31m⚠️ Masukkan angka yang valid antara 1 sampai 500000!\x1b[0m\n");
            rl.prompt();
            return;
        }

        cetak(`\n\x1b[33m⏳ Memulai pencetakan dari 1 sampai ${target}...\x1b[0m`);
        
        // Loop pencetakan baris per baris secara otomatis
        for (let i = 1; i <= target; i++) {
            cetak(i.toString());
        }

        cetak(`\x1b[32m\n✅ Selesai mencetak ${target} baris!\x1b[0m`);
        cetak("💡 Masukkan angka lagi untuk hitung baru, atau ketik \x1b[35m/vcxmenu\x1b[0m.");
        rl.prompt();
    }
});

// Inisialisasi awal saat tools pertama kali di-load
tampilkanMenu();
