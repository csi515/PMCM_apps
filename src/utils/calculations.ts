// RPN 계산
export function calculateRPN(severity: number, occurrence: number, detection: number): number {
  return severity * occurrence * detection;
}

// 평균 계산
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

// 표준편차 계산
export function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = calculateMean(values);
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = calculateMean(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
}

// Cpk 계산
export function calculateCpk(values: number[], usl: number, lsl: number, target: number): number {
  if (values.length === 0) return 0;
  
  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values);
  
  if (stdDev === 0) return 0;
  
  const cpkUpper = (usl - mean) / (3 * stdDev);
  const cpkLower = (mean - lsl) / (3 * stdDev);
  
  return Math.min(cpkUpper, cpkLower);
}

// Ppk 계산
export function calculatePpk(values: number[], usl: number, lsl: number): number {
  if (values.length === 0) return 0;
  
  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values);
  
  if (stdDev === 0) return 0;
  
  const ppkUpper = (usl - mean) / (3 * stdDev);
  const ppkLower = (mean - lsl) / (3 * stdDev);
  
  return Math.min(ppkUpper, ppkLower);
}

// Xbar-R 관리도 데이터 계산
export interface XbarRData {
  subgroup: number;
  xbar: number;
  r: number;
  values: number[];
}

export function calculateXbarR(data: Array<{ value: number }>, subgroupSize: number = 5): XbarRData[] {
  const subgroups: XbarRData[] = [];
  
  for (let i = 0; i < data.length; i += subgroupSize) {
    const subgroup = data.slice(i, i + subgroupSize);
    if (subgroup.length > 0) {
      const values = subgroup.map(d => d.value);
      const xbar = calculateMean(values);
      const r = Math.max(...values) - Math.min(...values);
      
      subgroups.push({
        subgroup: Math.floor(i / subgroupSize) + 1,
        xbar,
        r,
        values,
      });
    }
  }
  
  return subgroups;
}

