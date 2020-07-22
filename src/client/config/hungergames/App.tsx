import React from 'react';
// import styles from './App.module.scss';
// import IAppProps from './IAppProps';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/header/Header';
import EventsTable from './components/eventsTable/EventsTable';
import EventService from './services/EventService';
import ItemService from './services/ItemService';
import ItemsTable from './components/itemsTable/ItemsTable';
import ItemForm from './components/itemForm/ItemForm';
import EventForm from './components/eventForm/EventForm';

const App: React.FC = () => {
  const eventService = new EventService();
  const itemService = new ItemService();

  return (
    <div>
      <BrowserRouter basename={'/hungergames'}>
        <Header />
        <Switch>
          <Route
            path={'/event'}
            exact={true}
            render={routeProps => (
              <EventsTable eventService={eventService} {...routeProps} />
            )}
          />
          <Route
            path={'/event/new'}
            render={routeProps => (
              <EventForm eventService={eventService} {...routeProps} />
            )}
          />
          <Route
            path={'/event/:id'}
            render={routeProps => (
              <EventForm eventService={eventService} {...routeProps} />
            )}
          />
          <Route
            path={'/item'}
            exact={true}
            render={routeProps => (
              <ItemsTable itemService={itemService} {...routeProps} />
            )}
          />
          <Route
            path={'/item/new'}
            render={routeProps => (
              <ItemForm itemService={itemService} {...routeProps} />
            )}
          />
          <Route
            path={'/item/:id'}
            render={routeProps => (
              <ItemForm itemService={itemService} {...routeProps} />
            )}
          />
          <Redirect to={'/event'} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
