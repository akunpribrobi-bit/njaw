const fs = require('fs');
const readline = require('readline');

// Membuka terminal secara langsung agar input bekerja saat di-curl
const inputTerminal = fs.createReadStream('/dev/tty');
const outputTerminal = fs.createWriteStream('/dev/tty');

const rl = readline.createInterface({
    input: inputTerminal,
    output: outputTerminal
});

// Menghasilkan angka acak 1 - 100
const angkaRahasia = Math.floor(Math.random() * 100) + 1;
let jumlahTebakan = 0;

outputTerminal.write("\n\x1b[36m=== GAME TEBAK ANGKA (GITHUB & TERMUX VERSION) ===\x1b[0m\n");
outputTerminal.write("Komputer telah memilih angka antara 1 sampai 100.\n");
outputTerminal.write("Silakan tebak angkanya!\n\n");

function mainkanGame() {
    rl.question('Masukkan tebakanmu: ', (input) => {
        const tebakan = parseInt(input.trim());
        jumlahTebakan++;

        if (isNaN(tebakan)  tebakan < 1  tebakan > 100) {
            outputTerminal.write("❌ Input salah! Masukkan angka saja antara 1 - 100.\n\n");
            mainkanGame();
            return;
        }

        if (tebakan === angkaRahasia) {
            outputTerminal.write(\n\x1b[32m🎉 BENAR! Angkanya adalah ${angkaRahasia}.\x1b[0m\n);
            outputTerminal.write(🏆 Kamu berhasil menebak dalam ${jumlahTebakan} kali percobaan.\n\n);
            rl.close();
            process.exit(0);
        } else if (tebakan < angkaRahasia) {
            outputTerminal.write("📉 Terlalu RENDAH! Coba angka yang lebih besar.\n\n");
            mainkanGame();
        } else {
            outputTerminal.write("📈 Terlalu TINGGI! Coba angka yang lebih kecil.\n\n");
            mainkanGame();
        }
    });
}

mainkanGame();
