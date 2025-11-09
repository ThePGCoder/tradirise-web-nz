"use client";

import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Box, Chip, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import InnerCustomCard from "@/components/InnerCustomCard";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  plan_name: string;
  created_at: string;
}

type ChipColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default";

const PaymentsTab: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Please log in to view your payment history");
        } else {
          setError("Failed to load payment history");
        }
        return;
      }

      const data = await response.json();
      setPayments(data.payments || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Assuming amount is in cents
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string): ChipColor => {
    switch (status.toLowerCase()) {
      case "succeeded":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const columns: GridColDef[] = [
    {
      field: "created_at",
      headerName: "Date",
      width: 180,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "plan_name",
      headerName: "Plan",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          sx={{ userSelect: "none" }}
        />
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 130,
      valueFormatter: (value, row) => {
        return formatCurrency(value, row.currency);
      },
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            userSelect: "none",
          }}
        >
          {params.value.toUpperCase()}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={getStatusColor(params.value)}
          sx={{ userSelect: "none" }}
        />
      ),
    },
  ];

  const handleRowClick = (params: GridRowParams) => {
    console.log("Payment details:", params.row);
    // You could open a modal with payment details here
  };

  if (error) {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography variant="h5" gutterBottom sx={{ userSelect: "none" }}>
          Payment History
        </Typography>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="error" sx={{ userSelect: "none" }}>
            {error}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", py: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ userSelect: "none" }}>
        Payment History
      </Typography>

      <InnerCustomCard>
        <DataGrid
          rows={payments}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          onRowClick={handleRowClick}
          sx={{
            border: 0,
            backgroundColor: "background.paper",
            "& .MuiDataGrid-cell": {
              userSelect: "none",
            },
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "action.hover",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.default",
              borderBottom: 1,
              borderColor: "divider",
              userSelect: "none",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "background.default",
              borderTop: 1,
              borderColor: "divider",
              userSelect: "none",
            },
          }}
          disableRowSelectionOnClick
        />
      </InnerCustomCard>

      {payments.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ userSelect: "none" }}
          >
            No payments found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PaymentsTab;
