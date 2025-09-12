import React, { useState, useEffect } from "react";
import styles from "./styles/InputText.module.css"; // reutiliza mesmo estilo

interface InputDateProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  value?: string; // ISO format: YYYY-MM-DD
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  onChange?: (isoValue: string) => void;
}

export function InputDate({
  value,
  label,
  error,
  className,
  leftIcon,
  onChange,
  ...props
}: InputDateProps) {
  const hasError = !!error && error.length > 0;

  // Local para mostrar no input (DD/MM/YYYY)
  const [displayValue, setDisplayValue] = useState("");

  // Quando o valor externo mudar, sincroniza
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split("-");
      if (y && m && d) setDisplayValue(`${d}/${m}/${y}`);
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const isValidDate = (dd: number, mm: number, yyyy: number) => {
    const date = new Date(yyyy, mm - 1, dd);
    return (
      date.getFullYear() === yyyy &&
      date.getMonth() === mm - 1 &&
      date.getDate() === dd
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, ""); // somente dígitos
    if (raw.length > 2) raw = raw.slice(0, 2) + "/" + raw.slice(2);
    if (raw.length > 5) raw = raw.slice(0, 5) + "/" + raw.slice(5, 9);

    setDisplayValue(raw);

    // Tenta converter para ISO se válido
    const parts = raw.split("/");
    let iso = "";
    if (parts.length === 3 && parts[2].length === 4) {
      const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
      if (
        !isNaN(dd) &&
        !isNaN(mm) &&
        !isNaN(yyyy) &&
        isValidDate(dd, mm, yyyy)
      ) {
        iso = `${yyyy.toString().padStart(4, "0")}-${mm
          .toString()
          .padStart(2, "0")}-${dd.toString().padStart(2, "0")}`;
      }
    }

    onChange?.(iso); // só dispara se for válido, senão envia string vazia
  };

  return (
    <div className={styles.container}>
      {label && (
        <label className={`${styles.label} ${error ? styles.labelError : ""}`}>
          {label}
        </label>
      )}
      {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
      <input
        className={`${styles.input} ${className || ""}`}
        style={{
          borderColor: hasError ? "var(--color-error)" : "var(--color-border)",
          color: props.disabled ? "var(--color-text-muted)" : "var(--color-text)",
        }}
        type="text"
        placeholder="DD/MM/AAAA"
        value={displayValue}
        onChange={handleChange}
        maxLength={10} // DD/MM/YYYY tem 10 caracteres
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
