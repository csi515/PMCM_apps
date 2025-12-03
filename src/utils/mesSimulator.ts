import { SPCMeasurement } from '../types';

// MES 데이터 시뮬레이터
export function generateMESData(processName: string = '공정 A', sampleCount: number = 25): SPCMeasurement[] {
  const data: SPCMeasurement[] = [];
  const target = 100; // 목표값
  const tolerance = 5; // 공차
  
  for (let i = 0; i < sampleCount; i++) {
    // 정규분포를 따르는 랜덤 데이터 생성
    const mean = target + (Math.random() - 0.5) * 2; // 목표값 주변
    const stdDev = 1.5;
    const value = mean + (Math.random() + Math.random() + Math.random() + Math.random() - 2) * stdDev;
    
    data.push({
      id: i + 1,
      process: processName,
      value: Math.round(value * 100) / 100,
      timestamp: new Date(Date.now() - (sampleCount - i) * 3600000).toISOString(),
    });
  }
  
  return data;
}

