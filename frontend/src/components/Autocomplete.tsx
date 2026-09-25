import { useEffect, useId, useMemo, useRef, useState } from "react";

export type AutocompleteOption = {
  id: string | number;
  label: string;
};

type AutocompleteProps = {
  value: string;
  options: AutocompleteOption[];
  placeholder?: string;
  disabled?: boolean;
  allowCreate?: boolean;
  onChange: (value: string) => void;
  onSelect: (option: AutocompleteOption | null) => void;
};

export function Autocomplete({
  value,
  options,
  placeholder,
  disabled,
  allowCreate = true,
  onChange,
  onSelect,
}: AutocompleteProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const normalizedValue = value.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedValue) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(normalizedValue));
  }, [options, normalizedValue]);

  const exactMatch = options.some((option) => option.label.toLowerCase() === normalizedValue);
  const showCreate = allowCreate && normalizedValue.length > 0 && !exactMatch;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectOption(option: AutocompleteOption) {
    onChange(option.label);
    onSelect(option);
    setOpen(false);
  }

  function createOption() {
    onSelect(null);
    setOpen(false);
  }

  return (
    <div className="position-relative" ref={containerRef}>
      <input
        type="text"
        className="form-control"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        autoComplete="off"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onChange(event.target.value);
          onSelect(null);
          setOpen(true);
        }}
      />

      {open && (filtered.length > 0 || showCreate) && (
        <div
          id={listId}
          className="list-group position-absolute w-100 shadow-sm mt-1"
          style={{ zIndex: 20, maxHeight: "220px", overflowY: "auto" }}
        >
          {filtered.map((option) => (
            <button
              key={option.id}
              type="button"
              className="list-group-item list-group-item-action"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(option)}
            >
              {option.label}
            </button>
          ))}
          {showCreate && (
            <button
              type="button"
              className="list-group-item list-group-item-action text-primary"
              onMouseDown={(event) => event.preventDefault()}
              onClick={createOption}
            >
              Criar “{value.trim()}”
            </button>
          )}
        </div>
      )}
    </div>
  );
}
