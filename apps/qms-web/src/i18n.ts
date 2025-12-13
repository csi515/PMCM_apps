
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "welcome": "Welcome to QMS",
                    "voc": "VOC Management",
                    "fmea": "FMEA",
                }
            },
            ko: {
                translation: {
                    "welcome": "QMS 품질 관리 시스템",
                    "voc": "VOC 통합 관리",
                    "fmea": "FMEA 고장 모드 분석",
                }
            },
            ja: {
                translation: {
                    "welcome": "QMS 品質管理システム",
                    "voc": "VOC 統合管理",
                    "fmea": "FMEA 故障モード分析",
                }
            }
        },
        lng: "ko", // Default to Korean
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
