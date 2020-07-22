import React from 'react';
import styles from './Header.module.scss';
// import IHeaderProps from './IHeaderProps';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import { Link as RouterLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' className={styles.title}>
          Hunger Games Config Panel
        </Typography>
        <Button component={RouterLink} color='inherit' to={'/event'}>
          Events
        </Button>
        <Button component={RouterLink} color='inherit' to={'/item'}>
          Items
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
