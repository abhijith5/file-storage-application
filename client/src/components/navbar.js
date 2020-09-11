import React, { Component } from 'react'
import { Navbar, Button, Modal } from "react-bootstrap"
import UploadFunction from "./uploadFunction"

export default class HomeNavbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
    }

    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">File Storage Application</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <UploadFunction userDetails={this.props.navUser}></UploadFunction>

                        {this.props.navUser && this.props.navUser.length > 0 ?
                            <Navbar.Text>
                                Welcome <a href="#login"> {this.props.navUser[0].username}</a>
                            </Navbar.Text> : null}
                    </Navbar.Collapse>
                </Navbar>


            </div>
        )
    }
}
