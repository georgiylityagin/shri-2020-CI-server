import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import { StartPage } from './components/StartPage/StartPage';
import { HistoryPage } from './components/HistoryPage/HistoryPage';
import { SettingsPage } from './components/SettingsPage/SettingsPage';
import { DetailsPage } from './components/DetailsPage/DetailsPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact><StartPage /></Route>
        <Route path='/settings'><SettingsPage /></Route>
        <Route path='/history'><HistoryPage /></Route>
      </Switch>
    </Router>
  );
}

export default App;
