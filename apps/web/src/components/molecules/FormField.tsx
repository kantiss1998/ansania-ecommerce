import React from "react";

import { Input, InputProps } from "../atoms/Input";
import { Stack } from "../layout/Stack";

interface FormFieldProps extends InputProps {
  containerClassName?: string;
}

export const FormField = ({
  label,
  error,
  helperText,
  containerClassName,
  ...props
}: FormFieldProps) => {
  return (
    <Stack spacing={1} className={containerClassName}>
      <Input label={label} error={error} helperText={helperText} {...props} />
    </Stack>
  );
};
