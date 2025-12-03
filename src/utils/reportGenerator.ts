import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Excel 내보내기 유틸리티
export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// PDF 보고서 생성
export const generatePDFReport = (
  title: string,
  content: { headers: string[]; rows: any[][] },
  filename: string
) => {
  const doc = new jsPDF();
  
  // 제목 추가
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  // 날짜 추가
  doc.setFontSize(10);
  doc.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, 14, 30);
  
  // 테이블 추가
  (doc as any).autoTable({
    head: [content.headers],
    body: content.rows,
    startY: 35,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [14, 165, 233] },
  });
  
  doc.save(`${filename}.pdf`);
};

// FMEA 보고서 생성
export const generateFMEAReport = (fmeaData: any[], projectName: string) => {
  const doc = new jsPDF();
  
  // 제목
  doc.setFontSize(18);
  doc.text('DFMEA 보고서', 14, 20);
  
  // 프로젝트 정보
  doc.setFontSize(12);
  doc.text(`프로젝트: ${projectName}`, 14, 30);
  doc.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, 14, 37);
  
  // 테이블 데이터 준비
  const tableData = fmeaData.map(item => [
    item.failureMode,
    item.effect,
    item.cause,
    item.severity.toString(),
    item.occurrence.toString(),
    item.detection.toString(),
    item.rpn.toString(),
  ]);
  
  (doc as any).autoTable({
    head: [['고장모드', '영향', '원인', 'S', 'O', 'D', 'RPN']],
    body: tableData,
    startY: 45,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [14, 165, 233] },
  });
  
  doc.save(`DFMEA_Report_${projectName}_${Date.now()}.pdf`);
};

// 통계 보고서 생성
export const generateStatisticsReport = (
  stats: {
    totalItems: number;
    highRPN: number;
    averageRPN: number;
    statusBreakdown: Record<string, number>;
  },
  filename: string
) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('통계 보고서', 14, 20);
  doc.setFontSize(10);
  doc.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, 14, 30);
  
  let yPos = 45;
  doc.setFontSize(12);
  doc.text('주요 지표', 14, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.text(`전체 항목 수: ${stats.totalItems}`, 14, yPos);
  yPos += 7;
  doc.text(`고위험 항목 (RPN > 100): ${stats.highRPN}`, 14, yPos);
  yPos += 7;
  doc.text(`평균 RPN: ${stats.averageRPN.toFixed(2)}`, 14, yPos);
  yPos += 10;
  
  doc.setFontSize(12);
  doc.text('상태별 분포', 14, yPos);
  yPos += 10;
  
  const statusRows = Object.entries(stats.statusBreakdown).map(([status, count]) => [
    status,
    count.toString(),
  ]);
  
  (doc as any).autoTable({
    head: [['상태', '개수']],
    body: statusRows,
    startY: yPos,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [14, 165, 233] },
  });
  
  doc.save(`${filename}.pdf`);
};

