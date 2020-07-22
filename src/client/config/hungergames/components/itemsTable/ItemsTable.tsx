import React, { useEffect, useState } from 'react';
import IItemsTableProps from './IItemsTableProps';
import Typography from '@material-ui/core/Typography';
import ItemType from '../../../../../server/modules/games/hungerGames/items/ItemType';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Link from '@material-ui/core/Link';
import ViewIcon from '@material-ui/icons/OpenInNew';
import Container from '@material-ui/core/Container';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IItem from '../../../../../server/modules/games/hungerGames/database/schema/IItem';

const ItemsTable: React.FC<IItemsTableProps> = ({ itemService }) => {
  const [items, setItems] = useState<IItem[]>([]);

  const [typeIndex, setTypeIndex] = useState<number>(0);

  useEffect(() => {
    itemService.getAll().then(setItems);
  }, []);

  return (
    <Container>
      <Typography variant='h4'>Items</Typography>
      <Button
        variant='contained'
        color='primary'
        component={RouterLink}
        to={'/items/new'}
      >
        New Item
      </Button>
      <Tabs value={typeIndex} onChange={(ev, value) => setTypeIndex(value)}>
        <Tab label={'All'} />
        <Tab label={'Weapons'} />
        <Tab label={'Armour'} />
        <Tab label={'Food'} />
      </Tabs>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Strength</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .filter(item => typeIndex === 0 || item.type + 1 === typeIndex)
              .map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell component='th' scope='row'>
                    {item.name}
                  </TableCell>
                  <TableCell>{ItemType[item.type]}</TableCell>
                  <TableCell>{item.strength}</TableCell>
                  <TableCell>
                    <Link component={RouterLink} to={`/item/${item._id}`}>
                      <ViewIcon />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ItemsTable;
