import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import Signup from './components/signup';
import {
  Route, Link, Switch, BrowserRouter as Router,
} from 'react-router-dom'
import Login from './components/login';
import Routing from './routing';

export default class App extends Component {
  render() {
    return (
        <Router>
          <Routing></Routing>
        </Router>
    )
  }
}
