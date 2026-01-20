import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  forwardRef,
  type ComponentPropsWithoutRef,
  useCallback,
} from "react";
import Input from "./Input";

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "onChange" | "onSelect"
> {
  id: string;
  label?: string;
  error?: any;
  options: AutocompleteOption[];
  onChange: (value: string) => void;
  onSelect?: (option: AutocompleteOption) => void;
  placeholder?: string;
  noResultsText?: string;
  minChars?: number;
  isLoading?: boolean;
  loadingText?: string;
  serverFilter?: boolean;
  debounceMs?: number;
  onInputChange?: (value: string) => void;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      id,
      label,
      error,
      options,
      onChange,
      onSelect,
      placeholder = "Digite para buscar...",
      noResultsText = "Nenhum resultado encontrado",
      minChars = 0,
      isLoading = false,
      loadingText = "Carregando...",
      serverFilter = false,
      debounceMs = 300,
      onInputChange,
      className,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [filteredOptions, setFilteredOptions] = useState<
      AutocompleteOption[]
    >([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputContainerRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<number | null>(null);
    const lastSelectedValueRef = useRef<string | null>(null);

    // Debounced input change handler for server filter
    const debouncedInputChange = useCallback(
      (value: string) => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
          onInputChange?.(value);
        }, debounceMs);
      },
      [debounceMs, onInputChange],
    );

    // Filter options based on input (client-side) or use provided options (server-side)
    useEffect(() => {
      // Don't open dropdown if the current value is the last selected value
      if (lastSelectedValueRef.current === inputValue) {
        return;
      }

      if (serverFilter) {
        // For server filter, use options as provided by parent
        setFilteredOptions(options);
        setIsOpen(
          inputValue.length > 0 &&
            inputValue.length >= minChars &&
            (options.length > 0 || isLoading),
        );
      } else {
        // Client-side filtering
        if (inputValue.length > 0 && inputValue.length >= minChars) {
          const filtered = options.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase()),
          );
          setFilteredOptions(filtered);
          setIsOpen(filtered.length > 0);
        } else {
          setFilteredOptions([]);
          setIsOpen(false);
        }
      }
      setHighlightedIndex(-1);
    }, [inputValue, options, minChars, serverFilter, isLoading]);

    // Cleanup debounce timer
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          inputContainerRef.current &&
          !inputContainerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      onChange(value);

      // Clear last selected value when input changes
      if (lastSelectedValueRef.current !== null) {
        lastSelectedValueRef.current = null;
      }

      // For server filter, trigger debounced callback
      if (serverFilter) {
        debouncedInputChange(value);
      }
    };

    const handleOptionClick = (option: AutocompleteOption) => {
      setInputValue(option.label);
      onChange(option.value);
      onSelect?.(option);
      setIsOpen(false);
      setHighlightedIndex(-1);
      // Store the selected value to prevent reopening
      lastSelectedValueRef.current = option.label;
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            handleOptionClick(filteredOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    // Scroll highlighted item into view
    useEffect(() => {
      if (highlightedIndex >= 0 && dropdownRef.current) {
        const highlightedElement =
          dropdownRef.current.children[highlightedIndex];
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    }, [highlightedIndex]);

    return (
      <div className="relative" ref={inputContainerRef}>
        <Input
          ref={ref}
          id={id}
          label={label}
          error={error}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={className}
          {...props}
        />
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                {loadingText}
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    index === highlightedIndex
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-900"
                  }`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              inputValue.length >= minChars && (
                <div className="px-4 py-3 text-sm text-gray-500">
                  {noResultsText}
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  },
);

Autocomplete.displayName = "Autocomplete";

export default Autocomplete;
