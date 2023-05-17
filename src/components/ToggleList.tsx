import { useState } from 'react';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
} from '@mui/material';

interface ToggleProps {
  authorizedUser: string[];
}

export default function ToggleList(props: ToggleProps) {
  const [checked, setChecked] = useState(props.authorizedUser);
  const data = props.authorizedUser;

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List>
      {data.map((value) => (
        <ListItem
          key={value}
          secondaryAction={
            <Switch
              edge="end"
              onChange={handleToggle(value)}
              checked={checked.indexOf(value) !== -1}
              inputProps={{
                'aria-labelledby': 'switch-list-label-wifi',
              }}
            />
          }
        >
          <ListItemAvatar>
            <Avatar alt={`Avatar `} src={`/static/images/avatar/.jpg`} />
          </ListItemAvatar>
          <ListItemText primary={value} />
        </ListItem>
      ))}
    </List>
  );
}
