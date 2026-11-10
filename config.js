/**
 * CONFIG.JS - File Konfigurasi Utama Website Undangan Digital
 * Silakan sesuaikan URL Web App Google Apps Script dan aset jika sudah siap.
 */
const WEDDING_CONFIG = {
  groom: {
    fullName: "Adi Sutisna",
    shortName: "Adi",
    parents: "Putra dari Bapak Cucu Sopandi (Alm.) & Ibu Hj. Atik Sumarni",
    photo: "assets/images/groom-adi.jpg"
  },
  bride: {
    fullName: "Anita Intan Lestari",
    shortName: "Anita",
    parents: "Putri dari Bapak Wawan (Alm.) & Ibu Heni",
    photo: "assets/images/bride-anita.jpg"
  },
  event: {
    dateIso: "2026-11-28T09:00:00+07:00", // Format ISO 8601 Asia/Jakarta
    dateDisplay: "Sabtu, 28 November 2026",
    akadTime: "09.00 – 11.00 WIB",
    resepsiTime: "11.00 WIB – Selesai",
    locationName: "Rumah Mempelai Wanita",
    address: "Kp. Sindang Heula RT. 03 RW. 12, Desa Bayongbong, Kecamatan Bayongbong, Kabupaten Garut.",
    googleMapsUrl: "https://maps.app.goo.gl/HePrug4atrppLJDU6"
  },
  audio: {
    filePath: "assets/images/wedding-music.mp3" // Ganti dengan path file MP3 Anda
  },
  // Isikan URL Web App setelah melakukan deploy Google Apps Script
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbyBk809ODwrDOQ7-7nbz-PjGmnIjxpMzhi-nBjbyfYm9FDg2YQ7Kj2wOTlW85fGChHrEQ/exec",
  
  // Konfigurasi WhatsApp (Isi nomor jika sudah ada, format: 628xxxxxxxxxx)
  whatsappNumber: "",
  
  // Rekening Bank
  banks: [
    {
      bankName: "BANK BCA",
      accountNumber: "6768309877",
      accountHolder: "Adi Sutisna"
    },
    {
      bankName: "BANK BRI",
      accountNumber: "41790102 8468508",
      accountHolder: "Adi Sutisna"
    }
  ],
  
  // Gallery Prewedding (5-9 foto)
  gallery: [
    { src: "assets/images/gallery-1.jpg", alt: "Prewedding Adi & Anita 1" },
    { src: "assets/images/gallery-2.jpg", alt: "Prewedding Adi & Anita 2" },
    { src: "assets/images/gallery-3.jpg", alt: "Prewedding Adi & Anita 3" },
    { src: "assets/images/gallery-4.jpg", alt: "Prewedding Adi & Anita 4" },
    { src: "assets/images/gallery-5.jpg", alt: "Prewedding Adi & Anita 5" },
    { src: "assets/images/gallery-6.jpg", alt: "Prewedding Adi & Anita 6" }
  ]
};
