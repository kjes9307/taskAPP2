import React from 'react'

// React內建 挖屬性
// type SelectProps = React.ComponentProps<typeof Select>;

interface IselectProps{
    // extends Omit<SelectProps, "value" | "onChange" | "options">
    // 若有重複 會影響
    value : string | number | null | undefined
    onChange : (value?:number) => void
    defaultOptionName?: string;
    options?: { name: string; _id: string }[];
}
// value 可傳入多種值
// onChange只會return number | undefined
// isNaN(Number(value)) 不可轉換成number => defaultName
// onChange 返回undefined
export const IdSelect = (props: IselectProps) => {
    const { value, onChange, defaultOptionName, options, ...restProps } = props;
    return (
      <select
        value={options?.length ? toNumber(value) : 0}
        onChange={(value) => onChange?.(toNumber(value) || undefined)}
        {...restProps}
      >
        {defaultOptionName ? (
          <option value={0}>{defaultOptionName}</option>
        ) : null}
        {options?.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
    );
  };
  
  const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));
  