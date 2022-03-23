import { memo } from 'react';
import { Box, Typography } from '@mui/material';

interface SearchNotFoundProps {
  searchQuery?: string,
  className?: string,
}

export const SearchNotFound = memo(({ searchQuery = '', className, ...other }: SearchNotFoundProps) => {
  return (
    <Box className={className} {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Not found
      </Typography>
      {
        searchQuery && (
          <Typography variant="body2" align="center">
          No results found for &nbsp;
          <strong>&quot;{searchQuery}&quot;</strong>. Try checking for typos or
          using complete words.
        </Typography>
        )
      }
    </Box>
  );
})

export default SearchNotFound;
