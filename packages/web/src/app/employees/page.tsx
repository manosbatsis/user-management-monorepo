"use client";

import React from "react";
import {
  useDataGrid,
  EditButton,
  ShowButton,
  DeleteButton,
  List,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMany } from "@refinedev/core";

const EmployeeList = () => {
  const { dataGridProps } = useDataGrid();

  const { data: businessData, isLoading: businessIsLoading } = useMany({
    resource: "businesses",
    ids: dataGridProps?.rows?.map((item: any) => item?.businessId) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const { data: userData, isLoading: userIsLoading } = useMany({
    resource: "users",
    ids: dataGridProps?.rows?.map((item: any) => item?.userId) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "Id",
        minWidth: 50,
      },
      {
        field: "businessId",
        flex: 1,
        headerName: "Business",
        minWidth: 300,
        renderCell: function render({ value }) {
          return businessIsLoading ? (
            <>Loading...</>
          ) : (
            businessData?.data?.find((item) => item.id === value)
              ?.name
          );
        },
      },
      {
        field: "userId",
        flex: 1,
        headerName: "User",
        minWidth: 300,
        renderCell: function render({ value }) {
          return userIsLoading ? (
            <>Loading...</>
          ) : (
            userData?.data?.find((item) => item.id === value)
              ?.firstName +
            " " +
            userData?.data?.find((item) => item.id === value)
              ?.lastName
          );
        },
      },
      {
        field: "position",
        flex: 1,
        headerName: "Position",
        minWidth: 200,
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    [businessData?.data, userData?.data],
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};


export default EmployeeList
