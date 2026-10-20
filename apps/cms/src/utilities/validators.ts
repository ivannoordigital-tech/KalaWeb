/**
 * Reusable Field Validators & Normalizers for Kala CMS
 * Enforces data safety for operational admins & midwives without code manipulation.
 */

/**
 * Normalizes WhatsApp phone number to standard 628xxxxxxxxxx
 * Strips '+', '-', spaces, parentheses, and converts leading '08' to '628'.
 */
export function normalizeWhatsAppNumber(input?: string | null): string {
  if (!input) return '';
  let cleaned = String(input).replace(/[\s\-\+\(\)]/g, '');
  if (cleaned.startsWith('08')) {
    cleaned = '628' + cleaned.slice(2);
  }
  return cleaned;
}

/**
 * Validates Indonesian WhatsApp numbers (Must start with 628, 10–15 digits)
 */
export function validateWhatsAppNumber(val: any): true | string {
  if (!val) return 'Nomor WhatsApp wajib diisi.';
  const cleaned = normalizeWhatsAppNumber(val);
  const waRegex = /^628[0-9]{8,12}$/;
  if (!waRegex.test(cleaned)) {
    return 'Format nomor salah! Harus diawali 628 dengan panjang 10–14 digit (contoh: 6281234567890). Jangan gunakan angka 0 atau tanda + di awal.';
  }
  return true;
}

/**
 * Validates positive integers (e.g. price, duration, order)
 */
export function validatePositiveInteger(val: any, fieldLabel = 'Nilai'): true | string {
  if (val === undefined || val === null || val === '') return true;
  const num = Number(val);
  if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
    return `${fieldLabel} harus berupa bilangan bulat positif (contoh: 150000, 40).`;
  }
  return true;
}

/**
 * Validates strike-through price (original price) vs promo price (numeric price)
 */
export function validateOriginalPrice(originalPrice: any, numericPrice: any): true | string {
  if (!originalPrice) return true;
  const original = Number(String(originalPrice).replace(/[^0-9]/g, ''));
  const current = Number(numericPrice || 0);
  if (original > 0 && current > 0 && original <= current) {
    return `Harga coret (${original.toLocaleString('id-ID')}) wajib lebih tinggi dari harga promo (${current.toLocaleString('id-ID')}).`;
  }
  return true;
}
