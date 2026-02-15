import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Custom hook for keyboard shortcuts
 */
export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const isTyping = ['INPUT', 'TEXTAREA'].includes(e.target.tagName) || 
                       e.target.isContentEditable;
      
      if (isTyping) return;

      // Check for modifier keys (Ctrl/Cmd)
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Define shortcuts
      const shortcuts = {
        // Navigation shortcuts (without modifier)
        'h': () => navigate('/'),
        'a': () => navigate('/articles'),
        's': () => navigate('/search'),
        'b': () => navigate('/bookmarks'),
        'f': () => navigate('/feed'),
        'p': () => navigate('/profile'),
        
        // With Ctrl/Cmd modifier
        '/': () => {
          if (modifier) {
            e.preventDefault();
            showShortcutsHelp();
          }
        },
        'k': () => {
          if (modifier) {
            e.preventDefault();
            navigate('/search');
            // Focus search input if exists
            setTimeout(() => {
              const searchInput = document.querySelector('input[type="text"]');
              if (searchInput) searchInput.focus();
            }, 100);
          }
        },
      };

      // Execute shortcut
      const key = e.key.toLowerCase();
      if (shortcuts[key]) {
        if (!modifier || key === '/' || key === 'k') {
          shortcuts[key]();
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Show toast on mount
    const hasSeenShortcuts = localStorage.getItem('hasSeenShortcuts');
    if (!hasSeenShortcuts) {
      setTimeout(() => {
        toast('💡 Press ? to see keyboard shortcuts', { duration: 5000 });
        localStorage.setItem('hasSeenShortcuts', 'true');
      }, 2000);
    }

    // Cleanup
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
};

/**
 * Show shortcuts help modal
 */
const showShortcutsHelp = () => {
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };

  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">⌨️ Keyboard Shortcuts</h2>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Navigation</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-700 dark:text-gray-300">Go to Home</span>
              <kbd class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">H</kbd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-700 dark:text-gray-300">Go to Articles</span>
              <kbd class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">A</kbd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-700 dark:text-gray-300">Go to Search</span>
              <kbd class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">S</kbd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-700 dark:text-gray-300">Go to Bookmarks</span>
              <kbd class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">B</kbd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-700 dark:text-gray-300">Go to Feed</span>
              <kbd class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">F</kbd>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-700 dark:text-gray-300">Go to Profile</span>
              <kbd class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">P</kbd>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Actions</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-700 dark:text-gray-300">Quick Search</span>
              <div class="flex gap-1">
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">Ctrl</kbd>
                <span class="text-gray-500">+</span>
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">K</kbd>
              </div>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-700 dark:text-gray-300">Show this help</span>
              <kbd class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">?</kbd>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Shortcuts work when you're not typing in a text field
          </p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
};

// Keyboard Shortcuts Component (for settings page)
export const KeyboardShortcutsDisplay = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          ⌨️ Keyboard Shortcuts
        </h3>
        <button
          onClick={showShortcutsHelp}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Navigation</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">H, A, S, B, F, P</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Quick Search</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">Ctrl + K</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Show Help</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">?</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          Press <kbd className="px-2 py-0.5 bg-white dark:bg-gray-700 rounded text-xs">?</kbd> to see all shortcuts
        </p>
      </div>
    </div>
  );
};
