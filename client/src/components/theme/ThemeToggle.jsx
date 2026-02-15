import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();

  const themes = [
    { id: "light", label: "Light", icon: Sun, description: "Light theme" },
    { id: "dark", label: "Dark", icon: Moon, description: "Dark theme" },
    {
      id: "system",
      label: "System",
      icon: Monitor,
      description: "Follow system",
    },
  ];

  const handleThemeChange = (themeId) => {
    if (themeId === "light") setLightTheme();
    else if (themeId === "dark") setDarkTheme();
    else if (themeId === "system") setSystemTheme();
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Theme Preference
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive =
            theme === themeOption.id ||
            (themeOption.id === "system" && !["light", "dark"].includes(theme));

          return (
            <button
              key={themeOption.id}
              onClick={() => handleThemeChange(themeOption.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isActive
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Icon
                className={`h-6 w-6 mx-auto mb-2 ${
                  isActive
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
              <p
                className={`text-sm font-medium ${
                  isActive
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {themeOption.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {themeOption.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeToggle;
