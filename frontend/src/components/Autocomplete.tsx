import { useEffect, useId, useMemo, useRef, useState } from "react";

export type AutocompleteOption = {
  id: string | number;
  label: string;
};

type AutocompleteProps = {
  id?: string;
  value: string;
  options: AutocompleteOption[];
  placeholder?: string;
  disabled?: boolean;
  allowCreate?: boolean;
  onChange: (value: string) => void;
  onSelect: (option: AutocompleteOption | null) => void;
};

export function Autocomplete({
  id,
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
  const [activeIndex, setActiveIndex] = useState(-1);

  const normalizedValue = value.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedValue) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(normalizedValue));
  }, [options, normalizedValue]);

  const exactMatch = options.some((option) => option.label.toLowerCase() === normalizedValue);
  const showCreate = allowCreate && normalizedValue.length > 0 && !exactMatch;
  const optionCount = filtered.length + (showCreate ? 1 : 0);
  const visible = open && optionCount > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (visible && activeIndex >= 0) {
      document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, listId, visible]);

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
    <div
      className="position-relative"
      ref={containerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <input
        id={id}
        type="text"
        className="form-control"
        role="combobox"
        aria-expanded={visible}
        aria-controls={visible ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={visible && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        autoComplete="off"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onFocus={() => {
          setOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
            setActiveIndex(-1);
          } else if ((event.key === "ArrowDown" || event.key === "ArrowUp") && optionCount > 0) {
            event.preventDefault();
            setOpen(true);
            const delta = event.key === "ArrowDown" ? 1 : -1;
            setActiveIndex((current) =>
              current < 0
                ? delta > 0
                  ? 0
                  : optionCount - 1
                : (current + delta + optionCount) % optionCount,
            );
          } else if (event.key === "Enter" && visible && activeIndex >= 0) {
            event.preventDefault();
            const option = filtered[activeIndex];
            if (option) selectOption(option);
            else if (showCreate) createOption();
            setActiveIndex(-1);
          }
        }}
        onChange={(event) => {
          onChange(event.target.value);
          onSelect(null);
          setOpen(true);
          setActiveIndex(-1);
        }}
      />

      {visible && (
        <div
          id={listId}
          role="listbox"
          aria-label="Sugestões"
          className="list-group autocomplete-options"
        >
          {filtered.map((option, index) => (
            <button
              id={`${listId}-${index}`}
              key={option.id}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              tabIndex={-1}
              className={`list-group-item list-group-item-action${index === activeIndex ? " active" : ""}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(option)}
            >
              {option.label}
            </button>
          ))}
          {showCreate && (
            <button
              id={`${listId}-${filtered.length}`}
              type="button"
              role="option"
              aria-selected={activeIndex === filtered.length}
              tabIndex={-1}
              className={`list-group-item list-group-item-action text-primary${activeIndex === filtered.length ? " active" : ""}`}
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
