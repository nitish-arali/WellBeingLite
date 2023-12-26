// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://smilesinmilez.com" target="_blank" underline="hover">
      Smiles In Milez
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://smilesinmilez.com" target="_blank" underline="hover">
      &copy; Smiles In Milez
    </Typography>
  </Stack>
);

export default AuthFooter;
