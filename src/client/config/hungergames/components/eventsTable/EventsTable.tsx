import React, { useEffect, useMemo, useState } from 'react';
import styles from './EventsTable.module.scss';
import IEventsTableProps from './IEventsTableProps';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import EventType from '../../../../../server/modules/games/hungerGames/events/EventType';
import { startCase } from 'lodash';
import Link from '@material-ui/core/Link';
import ViewIcon from '@material-ui/icons/OpenInNew';
import Container from '@material-ui/core/Container';
import IEvent from '../../../../../server/modules/games/hungerGames/database/schema/IEvent';
import Positive from '../../../../../server/modules/games/hungerGames/events/Positive';
import Neutral from '../../../../../server/modules/games/hungerGames/events/Neutral';
import Negative from '../../../../../server/modules/games/hungerGames/events/Negative';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { getCategories } from '../eventForm/EventForm';
import FormControl from '@material-ui/core/FormControl';

function getCategoryName(event: IEvent) {
  if (event.category === undefined) return;

  switch (event.type) {
    case EventType.Positive:
      return Positive[event.category];
    case EventType.Neutral:
      return Neutral[event.category];
    case EventType.Negative:
      return Negative[event.category];
  }
}

function isPositive(minMax: [number, number]) {
  return minMax[1] >= 0;
}

function getStatChanges(event: IEvent) {
  if (!event.statChanges) return;

  const getSymbol = (minMax: [number, number]) =>
    isPositive(minMax) ? '+' : '-';

  const { health, hunger, stamina } = event.statChanges;

  const changes = [];
  if (health?.length) changes.push(`H${getSymbol(health)}`);
  if (hunger?.length) changes.push(`F${getSymbol(hunger)}`);
  if (stamina?.length) changes.push(`S${getSymbol(stamina)}`);

  return changes.join(' ');
}

const EventsTable: React.FC<IEventsTableProps> = ({ eventService }) => {
  const [events, setEvents] = useState<IEvent[]>([]);

  const [typeIndex, setTypeIndex] = useState<number>(0);
  const [categoryIndex, setCategoryIndex] = useState<
    Positive | Negative | Neutral
  >(0);
  const categories = useMemo(() => getCategories(typeIndex - 1), [typeIndex]);

  useEffect(() => {
    eventService.getAll().then(setEvents);
  }, []);

  useEffect(() => {
    setCategoryIndex(0);
  }, [typeIndex]);

  return (
    <Container>
      <Typography variant='h4'>Events</Typography>
      <Button
        variant='contained'
        color='primary'
        component={RouterLink}
        to={'/event/new'}
      >
        New Event
      </Button>

      <Tabs
        value={typeIndex}
        onChange={(ev, value) => setTypeIndex(value)}
        variant='scrollable'
        scrollButtons='auto'
      >
        <Tab label={'All'} />
        <Tab label={'Positive'} />
        <Tab label={'Neutral'} />
        <Tab label={'Negative'} />
        <Tab label={'Encounter'} />
      </Tabs>
      {categories && (
        <Select
          value={categoryIndex}
          onChange={ev =>
            setCategoryIndex(ev.target.value as Positive | Neutral | Negative)
          }
        >
          <MenuItem value={0}>All</MenuItem>
          {categories.map(category => (
            <MenuItem key={category.key + 1} value={category.key + 1}>
              {category.text}
            </MenuItem>
          ))}
        </Select>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Stat Changes</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events
              .filter(
                event =>
                  (typeIndex === 0 || event.type + 1 === typeIndex) &&
                  (!categories ||
                    categoryIndex === 0 ||
                    event.category! + 1 === categoryIndex)
              )
              .map((event: any) => (
                <TableRow key={event._id}>
                  <TableCell component='th' scope='row'>
                    {event.description}
                  </TableCell>
                  <TableCell>{EventType[event.type]}</TableCell>
                  <TableCell>{startCase(getCategoryName(event))}</TableCell>
                  <TableCell>{getStatChanges(event)}</TableCell>
                  <TableCell>
                    <Link component={RouterLink} to={`/event/${event._id}`}>
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

export default EventsTable;
