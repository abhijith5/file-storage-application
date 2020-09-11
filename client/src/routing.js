import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import Signup from './components/signup';
import {
    Route, Link, Switch, BrowserRouter as Router,
} from 'react-router-dom'
import Login from './components/login';
import Home from './components/home';

export default class Routing extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/signin" component={Login} />
                    <Route path="/" component={Signup} />
                    <Route path="/home" component={Home} />

                </Switch>
            </div>
        )
    }
}
