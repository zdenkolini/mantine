import { useState } from 'react';

type SetStateAction<T> = (prev: T | undefined) => T;
type OnChange<T> = (value: T, ...payload: any[]) => void;

export type UseUncontrolledReturnValue<T> = [
  T,
  (value: T | SetStateAction<T>, ...payload: any[]) => void,
  boolean,
];

// Controlled overload
export function useUncontrolled<T>(options: {
  value: T;
  onChange: OnChange<T>;
  defaultValue?: T;
  finalValue?: T;
}): [T, OnChange<T>, true];

// Uncontrolled overload
export function useUncontrolled<T>(options?: {
  value?: undefined;
  onChange?: OnChange<T>;
  defaultValue?: T;
  finalValue?: T;
}): UseUncontrolledReturnValue<T>;

// Shared implementation
export function useUncontrolled<T>(
  options: {
    value?: T;
    onChange?: OnChange<T>;
    defaultValue?: T;
    finalValue?: T;
  } = {}
): UseUncontrolledReturnValue<T> | [T, OnChange<T>, true] {
  const { value, onChange, defaultValue, finalValue } = options;

  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(
    defaultValue !== undefined ? defaultValue : finalValue
  );

  const handleChange = (val: T | SetStateAction<T>, ...payload: any[]) => {
    if (typeof val === 'function') {
      setUncontrolledValue((prev) => {
        const newValue = (val as SetStateAction<T>)(prev);

        onChange?.(newValue, ...payload);
        return newValue;
      });
      return;
    }

    setUncontrolledValue(val);
    onChange?.(val, ...payload);
  };

  if (value !== undefined) {
    return [value, onChange!, true];
  }

  return [uncontrolledValue as T, handleChange, false];
}
