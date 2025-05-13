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
      const lines = content.split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('#')); // Remove comments and empty lines
      
      // Check if file has content
      if (lines.length <= 1) {
        resolve({ valid: false, message: "The file appears to be empty or has only headers." });
        return;
      }
      
      // Check for required headers
      const headerLine = lines[0].toLowerCase();
      const headers = headerLine.split(',').map(h => h.trim());
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
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length !== headers.length) {
          isValid = false;
          message = `Row ${i+1}: Has a different number of columns (${values.length}) than the header (${headers.length}).`;
          break;
        }
        
        // Find index of partner_user_id and contact
        const partnerUserIdIndex = headers.indexOf('partner_user_id');
        const contactIndex = headers.indexOf('contact');
        
        // Check if at least one value exists
        const hasPartnerUserIdValue = partnerUserIdIndex >= 0 && values[partnerUserIdIndex] !== '';
        const hasContactValue = contactIndex >= 0 && values[contactIndex] !== '';
        
        // Validate contact format if present
        if (hasContact && hasContactValue) {
          const contact = values[contactIndex];
          if (!/^\d{10}$/.test(contact)) {
            isValid = false;
            message = `Row ${i+1}: Contact "${contact}" must be exactly 10 digits.`;
            break;
          }
        }
        
        // Ensure at least one identifier is provided
        if (!hasPartnerUserIdValue && !hasContactValue) {
          isValid = false;
          message = `Row ${i+1}: Each row must have either partner_user_id or contact filled.`;
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
  // Create a more comprehensive sample with comments at top
  const content = 
    "# Sample CSV file for One Time Campaign\n" +
    "# Either partner_user_id OR contact (10 digit number) must be provided for each row\n" +
    "partner_user_id,contact\n" +
    "user123,9876543210\n" +
    "user456,8765432109\n" +
    "user789,\n" +
    ",9988776655\n";
    
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'razorpay_campaign_sample.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
