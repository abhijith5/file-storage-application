import React, { Component } from 'react'
import { Card, Form, Button } from "react-bootstrap"
import "../assets/styles.css"
import {
    Route, Link, Switch, Redirect, BrowserRouter as Router,
} from 'react-router-dom'
import Login from './login'
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";
import Home from './home'

export default class Signup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: "",
            email: "",
            password: "",
            conPassword: "",
            isSignUp: false,
            isWrongPassword: false
        }
    }

    onSubmit = async (e) => {
        e.preventDefault()

        if (this.state.conPassword === this.state.password) {
            axios.post("http://localhost:5000/register", {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }).then((res) => {
                this.setState({ isSignUp: true })
                toast.success("Successfully Registered", {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }).catch(err => console.error(err))
        } else {
            this.setState({ isWrongPassword: true })
        }


    }

    handler(key, value) {
        this.setState({ [key]: value })
    }

    render() {
        return (
            <div>

                <div className="signup-form">

                    {this.state.isSignUp === true ? <Login></Login> :
                        <Card style={{ width: '30rem' }}>
                            <Card.Body>
                                <Card.Title style={{ textAlign: "center", fontSize: "30px" }}>Sign Up</Card.Title>
                                <Form onSubmit={this.onSubmit}>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>User name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter username" onChange={(e) => this.handler("username", e.target.value)} />
                                    </Form.Group>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" onChange={(e) => this.handler("email", e.target.value)} />
                                        <Form.Text className="text-muted">
                                            We'll never share your email with anyone else.
                            </Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" onChange={(e) => this.handler("password", e.target.value)} />
                                    </Form.Group>
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control type="password" placeholder="Confirm Password" onChange={(e) => this.handler("conPassword", e.target.value)} />
                                        {this.state.isWrongPassword ? <span style={{ fontSize: "15px", color: "red" }}>Password mismatch</span>
                                            : null}
                                    </Form.Group>

                                    <span style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Button variant="primary" type="submit">
                                            Submit
                            </Button>
                                        <span style={{ paddingTop: ".5rem" }}>Already a user ? <Link to="/signin">Sign up here</Link></span>
                                    </span>
                                </Form>
                            </Card.Body>
                        </Card>
                    }
                    <ToastContainer />
                </div>
            </div>
        )
    }
}
