"use client";

import { useAppStore } from "@/lib/store";
import { PageType } from "@/types";

interface PageInfo {
  title: string;
  icon: string;
  description: string;
}

const pageInfo: Record<PageType, PageInfo> = {
  landing: {
    title: "Inicio",
    icon: "🏠",
    description: "Sube tu archivo de datos",
  },
  processing: {
    title: "Procesando",
    icon: "⚡",
    description: "Analizando tus datos",
  },
  results: {
    title: "Resultados",
    icon: "📊",
    description: "Selecciona tus gráficos",
  },
  dashboard: {
    title: "Dashboard",
    icon: "📈",
    description: "Visualiza y personaliza",
  },
};

export function PageNavigation() {
  const { currentPage, pageHistory, goToPage, goBack } = useAppStore();

  const getPageOrder = (): PageType[] => {
    return ["landing", "processing", "results", "dashboard"];
  };

  const getCurrentPageIndex = () => {
    return getPageOrder().indexOf(currentPage);
  };

  const isPageAccessible = (page: PageType): boolean => {
    const currentIndex = getCurrentPageIndex();
    const pageIndex = getPageOrder().indexOf(page);

    // Landing is always accessible
    if (page === "landing") return true;

    // Other pages are accessible if we've been there or if they're the next logical step
    return pageIndex <= currentIndex + 1;
  };

  const canGoBack = pageHistory.length > 0;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2">
            {getPageOrder().map((page, index) => {
              const info = pageInfo[page];
              const isActive = page === currentPage;
              const isAccessible = isPageAccessible(page);
              const isCompleted = getCurrentPageIndex() > index;

              return (
                <div key={page} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 text-gray-400 mx-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}

                  <button
                    onClick={() => isAccessible && goToPage(page)}
                    disabled={!isAccessible}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : isCompleted
                          ? "text-green-600 hover:bg-green-50"
                          : isAccessible
                          ? "text-gray-600 hover:bg-gray-50"
                          : "text-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    <span className="text-lg">{info.icon}</span>
                    <div className="text-left hidden sm:block">
                      <div className="text-sm font-medium">{info.title}</div>
                      <div className="text-xs opacity-75">
                        {info.description}
                      </div>
                    </div>

                    {/* Status indicator */}
                    {isCompleted && (
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            {/* Back Button */}
            {canGoBack && (
              <button
                onClick={goBack}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">Atrás</span>
              </button>
            )}

            {/* Page Counter */}
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {getCurrentPageIndex() + 1} de {getPageOrder().length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((getCurrentPageIndex() + 1) / getPageOrder().length) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
