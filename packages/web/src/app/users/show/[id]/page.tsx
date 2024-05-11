"use client";

import { MuiShowInferencer } from '@refinedev/inferencer/mui';

import { useShow } from "@refinedev/core";
import {
  Show,
  TextFieldComponent as TextField,
  EmailField,
  DateField,
} from "@refinedev/mui";
import { Typography, Stack } from "@mui/material";

const UserShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          Id
        </Typography>
        <TextField value={record?.id} />
        <Typography variant="body1" fontWeight="bold">
          Email
        </Typography>
        <EmailField value={record?.email} />
        <Typography variant="body1" fontWeight="bold">
          First Name
        </Typography>
        <TextField value={record?.firstName} />
        <Typography variant="body1" fontWeight="bold">
          Last Name
        </Typography>
        <TextField value={record?.lastName} />
        <Typography variant="body1" fontWeight="bold">
          Created At
        </Typography>
        <DateField value={record?.createdAt} />
        <Typography variant="body1" fontWeight="bold">
          Updated At
        </Typography>
        <DateField value={record?.updatedAt} />
        <Typography variant="body1" fontWeight="bold">
          Role
        </Typography>
        <TextField value={record?.role} />
      </Stack>
    </Show>
  );
};


export default UserShow
