// Fungsi untuk mengubah teks ke dalam bentuk biner
function textToBinary(text) {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
        let bin = text[i].charCodeAt().toString(2);
        binary += '00000000'.slice(bin.length) + bin;
    }
    return binary;
}

// Fungsi untuk menyisipkan teks ke dalam gambar menggunakan metode Spreadtrum
function spreadtrumEncryptImage(imagePath, text) {
    // Proses pengubahan teks ke dalam bentuk biner
    let binaryText = textToBinary(text);

    // Menampilkan representasi biner dari teks di kolom Binary_Output
    document.querySelector('.Binary_Output').value = binaryText;

    // Proses penggantian gambar di bawah font preview
    let image = new Image();
    image.src = imagePath;
    image.onload = function() {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        // Proses penggantian gambar di bawah font preview
        let newImage = canvas.toDataURL(); // Mengubah gambar ke dalam bentuk data URL
        document.querySelector('.image').src = newImage;

        // Proses pengunduhan gambar yang telah di proses
        let downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL(); // Mengubah gambar ke dalam bentuk data URL
        downloadLink.download = 'processed_image.png';
        downloadLink.click();
    };
}

// Event listener untuk button "UPLOAD IMAGE"
document.getElementById('uploadButton').addEventListener('click', function() {
    // Membuat elemen input file baru
    var input = document.createElement('input');
    input.type = 'file';

    // Menambahkan event listener untuk saat file dipilih
    input.addEventListener('change', function() {
        var file = input.files[0]; // Mendapatkan file yang dipilih
        // Lakukan logika untuk memproses file yang dipilih, misalnya menampilkan pratinjau gambar
        var reader = new FileReader();
        reader.onload = function(e) {
            var preview = document.querySelector('.image');
            preview.src = e.target.result; // Menampilkan pratinjau gambar
        }
        reader.readAsDataURL(file); // Membaca file sebagai URL data
    });

    // Klik input file secara otomatis saat tombol "UPLOAD IMAGE" ditekan
    input.click();
});

// Event listener untuk button "ENCODE"
document.getElementById('encodeButton').addEventListener('click', function() {
    let imagePath = 'path_to_uploaded_image.png'; // Ganti dengan path gambar yang diupload
    let text = document.querySelector('.Kolom_Input_Output').value;
    spreadtrumEncryptImage(imagePath, text);
});

// Event listener untuk button "DOWNLOAD"
document.getElementById('downloadButton').addEventListener('click', function() {
    let processedImagePath = 'path_to_processed_image.png'; // Ganti dengan path gambar yang telah di proses
    let downloadLink = document.createElement('a');
    downloadLink.href = processedImagePath;
    downloadLink.download = 'processed_image.png';
    downloadLink.click();
});
