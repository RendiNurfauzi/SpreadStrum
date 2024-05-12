document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click(); // Memicu klik pada input file
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        // Membuat FileReader untuk membaca file
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Mengatur sumber gambar ke hasil pembacaan file
            const imgElement = document.getElementById('previewImage');
            imgElement.src = e.target.result;
            
            // Memastikan gambar dimuat sebelum menggambar ke canvas
            imgElement.onload = function() {
                // Mendapatkan canvas dan konteksnya
                const canvas = document.getElementById('hiddenCanvas');
                const ctx = canvas.getContext('2d');
                
                // Menyesuaikan ukuran canvas dengan gambar
                canvas.width = imgElement.naturalWidth;
                canvas.height = imgElement.naturalHeight;
                
                // Menggambar gambar ke canvas
                ctx.drawImage(imgElement, 0, 0, imgElement.naturalWidth, imgElement.naturalHeight);
            };
        };
        
        // Membaca file sebagai URL data
        reader.readAsDataURL(file);
    }
});

document.getElementById('decodeButton').addEventListener('click', decodeMessageFromImage);

//function decodespreadSpectrum() {
    
//}

// Fungsi untuk mengacak array dengan seed
function shuffleArray(array, seed) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(seed * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
        seed = (seed * 100 + 100) % 10; // formula untuk menghasilkan angka acak
    }
    return array;
}

function stringToBitArray(string) {
    const bitArray = [];
    for (let i = 0; i < string.length; i++) {
        const charCode = string.charCodeAt(i);
        for (let j = 7; j >= 0; j--) {
            bitArray.push((charCode >> j) & 1);
        }
    }
    return bitArray;
}
function decodeMessageFromImage() {
    const canvas = document.getElementById('hiddenCanvas');
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Membuat array indeks piksel dan mengacaknya dengan seed yang sama
    let pixelIndices = Array.from({length: data.length}, (_, i) => i);
    pixelIndices = shuffleArray(pixelIndices, 128); // menggunakan seed 128

    let bits = [];
    for (let i = 0; i < data.length; i += 8) {
        const pixelIndex = pixelIndices[i];
        const bit = data[pixelIndex] & 1; // Mengambil least significant bit
        bits.push(bit);
    }

    const message = bitArrayToString(bits);
    document.querySelector('.Kolom_Input_Output').value = message;
}

function bitArrayToString(bitArray) {
    let string = '';
    for (let i = 0; i < bitArray.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) {
            byte |= bitArray[i + j] << (7 - j);
        }
        if (byte === 0) {
            break; // Menghentikan pembacaan jika menemukan byte 0, asumsi sebagai terminator
        }
        string += String.fromCharCode(byte);
    }
    return string;
}

