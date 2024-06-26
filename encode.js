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

document.getElementById('encodeButton').addEventListener('click', function() {
    spreadSpectrum();
    
});

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


function spreadSpectrum() {
    const canvas = document.getElementById('hiddenCanvas');
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const message = document.getElementById('secretMessage').value;
    const messageBits = stringToBitArray(message);
    
    if (messageBits.length * 8 > data.length) {
        alert('Pesan terlalu panjang untuk gambar ini.');
        return;
    }
    
    // Membuat array indeks piksel dan mengacaknya
    let pixelIndices = Array.from({length: data.length}, (_, i) => i);
    pixelIndices = shuffleArray(pixelIndices, 128); // menggunakan seed 128
    
    for (let i = 0; i < messageBits.length; i++) {
        for (let j = 0; j < 8; j++) {
            const pixelIndex = pixelIndices[i * 8 + j];
            data[pixelIndex] = (data[pixelIndex] & ~1) | messageBits[i];
        }
    }
    
    ctx.putImageData(imgData, 0, 0);
    alert('Pesan telah di-encode ke dalam gambar menggunakan metode Spread Spectrum.');
    
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
    
}    



document.getElementById('downloadButton').addEventListener('click', function() {
    const canvas = document.getElementById('hiddenCanvas');
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'encoded-image.png';
    link.href = image;
    link.click();
});
