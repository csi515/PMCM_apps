import * as XLSX from 'xlsx';
import { SPCMeasurement } from '../types';

export function parseExcelFile(file: File): Promise<SPCMeasurement[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet) as Array<Record<string, any>>;
        
        // 데이터 포맷팅 (예: { process, value, timestamp } 형식)
        const formattedData: SPCMeasurement[] = jsonData.map((row, index) => ({
          id: index + 1,
          process: row['공정'] || row['Process'] || '공정 A',
          value: parseFloat(row['값'] || row['Value'] || row['측정값'] || '0'),
          timestamp: row['시간'] || row['Timestamp'] || new Date().toISOString(),
        }));
        
        resolve(formattedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

