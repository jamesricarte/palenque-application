import { Dispatch, SetStateAction } from "react";

export const handleFormChange = <T>(
  setFormData: Dispatch<SetStateAction<T>>,
  field: keyof T,
  value: T[keyof T],
) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};
