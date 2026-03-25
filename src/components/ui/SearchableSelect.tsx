import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  options: { id: string; name: string }[];
  className?: string;
}

export function SearchableSelect({
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  options,
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.name === value);

  // When the dropdown opens, set search to empty or current selection's name
  useEffect(() => {
    if (isOpen) {
      setSearch(selectedOption?.name ?? '');
    }
  }, [isOpen, selectedOption]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-left text-ink focus:outline-none focus:ring-2 focus:ring-ajo-600/20 focus:border-ajo-600 transition-all appearance-none shadow-sm flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-ink' : 'text-ink-muted'}>
          {selectedOption?.name ?? placeholder}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-ink-muted transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search banks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ajo-600"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-ink-muted">No banks found</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.name)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-ajo-50 transition-colors ${
                    opt.name === value ? 'bg-ajo-100 text-ajo-800 font-medium' : 'text-ink'
                  }`}
                >
                  {opt.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
