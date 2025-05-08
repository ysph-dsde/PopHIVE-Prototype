import { CircularProgress, Typography } from "@mui/material";

export const DataLoading = () => {
  return (
    <>
      <CircularProgress />
      <Typography>Loading data...</Typography>
    </>
  );
};
