import React, { Component } from 'react'
import { Card, Form, Button } from "react-bootstrap"
import "../assets/styles.css"
import {
    Route, Redirect, Link, Switch, BrowserRouter as Router, NavLink,
} from 'react-router-dom'
import Signup from './signup'
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";
import Home from './home'


export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            email: "",
            password: "",
            conPassword: "",
            isLogin: false,
            isWrongPassword: false,
            userDetails: []
        }
    }
    handler(key, value) {
        this.setState({ [key]: value })
    }

    onSubmit = async (e) => {
        e.preventDefault()

        axios.post("http://localhost:5000/login", {
            email: this.state.email,
            password: this.state.password
        }).then((res) => {
            console.log(res.data)
            if (res.data.code === 300) {
                this.setState({ isLogin: true })
                let user = []
                user.push(res.data)
                this.setState({ userDetails: user })
                // localStorage.setItem("userdetails", user);
                toast.success("Successfully Registered", {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error("INvalid email or password ", {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

        }).catch(e => {
            this.setState({ isLogin: false })
            console.error(e.message)
        })

    }


    render() {
        return (
            <div>
                {this.state.isLogin ? <Home user={this.state.userDetails}></Home> :
                    <div className="signup-form">

                        <Card style={{ width: '30rem' }}>
                            <Card.Body>
                                <Card.Title style={{ textAlign: "center", fontSize: "30px" }}>Sign In</Card.Title>
                                <Form onSubmit={this.onSubmit}>
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

                                    <span style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Button variant="primary" type="submit">
                                            Submit
                        </Button>
                                        <span style={{ paddingTop: ".5rem" }}>Don't have an account <Link to="/signup">Sign in here</Link></span>
                                    </span>
                                </Form>
                            </Card.Body>
                        </Card>
                        <ToastContainer />

                    </div>}
            </div>
        )
    }
}
