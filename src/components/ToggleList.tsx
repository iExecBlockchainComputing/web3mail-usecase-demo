import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRevokeOneAccessMutation } from '../app/appSlice';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface ToggleProps {
  authorizedUser: string[];
  refreshAuthorizedUsers: () => void;
}

export default function ToggleList(props: ToggleProps) {
  const { authorizedUser, refreshAuthorizedUsers } = props;
  const { ProtectedDataId } = useParams();
  //query RTK API as mutation hook
  const [revokeOneAccess, result] = useRevokeOneAccessMutation();

  const handleDelete = (value: string) => () => {
    revokeOneAccess({ protectedData: ProtectedDataId!, authorizedUser: value });
  };

  //snackbar notification
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (result.isSuccess) {
      setOpen(true);
      refreshAuthorizedUsers();
    }
  }, [result]);
  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <List>
      {authorizedUser.map((value) => (
        <ListItem key={value}>
          <ListItemAvatar>
            <Avatar alt={`Avatar `} src={`/static/images/avatar/.jpg`} />
          </ListItemAvatar>
          <ListItemText primary={value} />
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={handleDelete(value)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
The granted access has been successfully revoked!

        </Alert>
      </Snackbar>
    </List>
  );
}
