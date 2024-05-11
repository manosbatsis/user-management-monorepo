"use client";

import { Edit, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";

const EmployeeEdit = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    control,
    formState: { errors },
  } = useForm();

  const employeesData = queryResult?.data?.data;

  const { autocompleteProps: businessAutocompleteProps } = useAutocomplete({
    resource: "businesses",
    defaultValue: employeesData?.businessId,
  });

  const { autocompleteProps: userAutocompleteProps } = useAutocomplete({
    resource: "users",
    defaultValue: employeesData?.userId,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("id", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.id}
          helperText={(errors as any)?.id?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Id"
          name="id"
          disabled
        />
        <Controller
          control={control}
          name="businessId"
          rules={{ required: "This field is required" }}
          // eslint-disable-next-line
          defaultValue={null as any}
          render={({ field }) => (
            <Autocomplete
              {...businessAutocompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value?.id ?? value);
              }}
              getOptionLabel={(item) => {
                return (
                  businessAutocompleteProps?.options?.find(
                    (p) =>
                      p?.id?.toString() ===
                      (item?.id ?? item)?.toString(),
                  )?.name ?? ""
                );
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined ||
                option?.id?.toString() ===
                (value?.id ?? value)?.toString()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Business"
                  margin="normal"
                  variant="outlined"
                  error={!!(errors as any)?.businessId}
                  helperText={
                    (errors as any)?.businessId?.message
                  }
                  required
                />
              )}
            />
          )}
        />
        <Controller
          control={control}
          name="userId"
          rules={{ required: "This field is required" }}
          // eslint-disable-next-line
          defaultValue={null as any}
          render={({ field }) => (
            <Autocomplete
              {...userAutocompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value?.id ?? value);
              }}
              getOptionLabel={(item) => {
                return (
                  userAutocompleteProps?.options?.find(
                    (p) =>
                      p?.id?.toString() ===
                      (item?.id ?? item)?.toString(),
                  )?.firstName ?? ""
                );
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined ||
                option?.id?.toString() ===
                (value?.id ?? value)?.toString()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="User"
                  margin="normal"
                  variant="outlined"
                  error={!!(errors as any)?.userId}
                  helperText={
                    (errors as any)?.userId?.message
                  }
                  required
                />
              )}
            />
          )}
        />
        <TextField
          {...register("position", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.position}
          helperText={(errors as any)?.position?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Position"
          name="position"
        />
      </Box>
    </Edit>
  );
};

export default EmployeeEdit
