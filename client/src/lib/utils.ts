import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(length: number = 12): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function formatIndianRupee(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

export function validateCsvFile(file: File): Promise<{ valid: boolean; message?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target || !event.target.result) {
        resolve({ valid: false, message: "Failed to read the file." });
        return;
      }
      
      const content = event.target.result as string;
      const lines = content.split('\n');
      
      // Check if file has content
      if (lines.length <= 1) {
        resolve({ valid: false, message: "The file appears to be empty or has only headers." });
        return;
      }
      
      // Check for required headers
      const headers = lines[0].toLowerCase().split(',');
      const hasPartnerUserId = headers.includes('partner_user_id');
      const hasContact = headers.includes('contact');
      
      if (!hasPartnerUserId && !hasContact) {
        resolve({
          valid: false,
          message: "The CSV must contain at least one of these headers: partner_user_id, contact."
        });
        return;
      }
      
      // Validate data rows
      let isValid = true;
      let message = "";
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines
        
        const values = lines[i].split(',');
        if (values.length !== headers.length) {
          isValid = false;
          message = `Row ${i} has a different number of columns than the header.`;
          break;
        }
        
        // Find index of partner_user_id and contact
        const partnerUserIdIndex = headers.indexOf('partner_user_id');
        const contactIndex = headers.indexOf('contact');
        
        // Check if at least one value exists
        const hasPartnerUserIdValue = partnerUserIdIndex >= 0 && values[partnerUserIdIndex].trim() !== '';
        const hasContactValue = contactIndex >= 0 && values[contactIndex].trim() !== '';
        
        if (hasContact && hasContactValue) {
          // Validate contact is 10 digits
          const contact = values[contactIndex].trim();
          if (!/^\d{10}$/.test(contact)) {
            isValid = false;
            message = `Row ${i}: Contact must be exactly 10 digits.`;
            break;
          }
        }
        
        if (!hasPartnerUserIdValue && !hasContactValue) {
          isValid = false;
          message = `Row ${i}: Each row must have either partner_user_id or contact filled.`;
          break;
        }
      }
      
      resolve({ valid: isValid, message });
    };
    
    reader.onerror = () => {
      resolve({ valid: false, message: "Error reading the file." });
    };
    
    reader.readAsText(file);
  });
}

export function downloadSampleCsv() {
  const content = "partner_user_id,contact\nuser123,9876543210\nuser456,8765432109\n";
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sample_customer_data.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
