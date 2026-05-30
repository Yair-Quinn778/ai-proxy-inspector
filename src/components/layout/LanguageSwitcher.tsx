import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@/i18n";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const currentIndex = SUPPORTED_LANGUAGES.findIndex(
      (l) => l.code === i18n.language
    );
    const nextLang =
      SUPPORTED_LANGUAGES[(currentIndex + 1) % SUPPORTED_LANGUAGES.length];
    i18n.changeLanguage(nextLang.code);
  };

  const currentLabel = SUPPORTED_LANGUAGES.find(
    (l) => l.code === i18n.language
  )?.label || "中文";

  return (
    <button
      onClick={toggleLanguage}
      className="fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
      title={t("settings.language")}
    >
      🌐 {currentLabel}
    </button>
  );
}
