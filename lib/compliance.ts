/**
 * Logika Perhitungan SLA Berdasarkan SK Ketua No 244 Tahun 2020
 * Menghitung hari kerja (Senin-Jumat) untuk akurasi hukum.
 */

export function calculateSLA(startDate: Date, daysToAdd: number): Date {
  let date = new Date(startDate);
  let addedDays = 0;
  
  while (addedDays < daysToAdd) {
    date.setDate(date.getDate() + 1);
    // 0 = Minggu, 6 = Sabtu. Hanya hitung hari kerja.
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      addedDays++;
    }
  }
  return date;
}

// Shortcut untuk Juknis
export const getFormilDeadline = (start: Date) => calculateSLA(start, 14);
export const getMateriilDeadline = (start: Date) => calculateSLA(start, 30);