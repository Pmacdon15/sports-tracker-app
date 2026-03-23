import type { AnyFormApi } from "@tanstack/react-form";
import type * as React from "react";
import { Combobox } from "./combobox";
import { Input } from "./input";
import { Label } from "./label";

interface BaseFieldProps {
  formApi: AnyFormApi;
  name: string;
  label?: string;
  validator?: any;
  disabled?: boolean;
  helperText?: string;
}

export function FormFieldInput({
  formApi,
  name,
  label,
  validator,
  disabled,
  helperText,
  ...props
}: BaseFieldProps & React.ComponentProps<typeof Input>) {
  // Access Field from formApi directly
  const { Field } = formApi as any;

  return (
    <div className="space-y-2 text-left">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Field
        name={name}
        validators={{
          onChange: validator,
        }}
      >
        {(field: any) => {
          const { errors, isTouched } = field.state.meta;
          return (
            <>
              <Input
                {...props}
                id={name}
                name={field.name}
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={disabled}
              />
              {errors.length > 0 && isTouched && (
                <span className="text-[10px] font-medium text-destructive mt-1 block">
                  {String(errors[0].message)}
                </span>
              )}
              {helperText && !errors.length && (
                <p className="text-xs text-muted-foreground">{helperText}</p>
              )}
            </>
          );
        }}
      </Field>
    </div>
  );
}

export function FormFieldCombobox({
  formApi,
  name,
  label,
  validator,
  disabled,
  helperText,
  options,
  placeholder,
  allowCustom,
}: BaseFieldProps & {
  options: { label: string; value: string }[];
  placeholder?: string;
  allowCustom?: boolean;
}) {
  const { Field } = formApi as any;

  return (
    <div className="space-y-2 text-left">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Field
        name={name}
        validators={{
          onChange: validator,
        }}
      >
        {(field: any) => {
          const { errors, isTouched } = field.state.meta;
          return (
            <>
              <Combobox
                options={options}
                value={field.state.value ?? ""}
                onValueChange={(val) => field.handleChange(val)}
                onBlur={field.handleBlur}
                placeholder={placeholder}
                allowCustom={allowCustom}
                disabled={disabled}
              />
              {errors.length > 0 && isTouched && (
                <span className="text-[10px] font-medium text-destructive mt-1 block">
                  {errors[0].message}
                </span>
              )}
              {helperText && !errors.length && (
                <p className="text-xs text-muted-foreground">{helperText}</p>
              )}
            </>
          );
        }}
      </Field>
    </div>
  );
}