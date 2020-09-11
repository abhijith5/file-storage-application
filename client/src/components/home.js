import React, { Component } from 'react'
import HomeNavbar from "./navbar"
import { Form, Container, Table, FormControl, InputGroup, Button } from 'react-bootstrap'
import axios from 'axios'

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userdata: [],
            searchText: ""
        }
    }

    async componentDidMount() {
        let userdata = await localStorage.getItem("userdetails")

        console.log(this.props.user)
        let role = false

        if (this.props.user[0].userrole === "admin") {
            await axios.post("http://localhost:5000/admin/pdf/data", {
                role: true
            }).then((res) => {
                console.log(res.data)
                this.setState({ userdata: res.data.data })
            }).catch(e => console.error(e))

        } else {
            await axios.post("http://localhost:5000/pdf/data", {
                userid: this.props.user[0].userid,
                role: false
            }).then((res) => {
                console.log(res.data)
                this.setState({ userdata: res.data.data })
            }).catch(e => console.error(e))

        }


    }

    tableData() {
        let result = []

        this.state.userdata && this.state.userdata.map((item, index) => {
            result.push(
                <tr>
                    <td>{index + 1}</td>
                    {this.props.user.length > 0 && this.props.user[0].userrole === "admin" ?
                        <td>{item.username}</td> : null}
                    <td>{item.pdfname}</td>
                    <td><Button onClick={(e) => this.downloadClick(item.pdfpath)}>Download</Button></td>
                </tr>
            )
        })

        return result
    }

    downloadClick(pdfpath) {
        // e.preventDefault()

        window.open(pdfpath)
    }

    searchText(e) {
        e.preventDefault()

        if (this.props.user.length > 0) {
            if (this.props.user[0].userrole === "admin") {

                axios.post("http://localhost:5000/admin/pdf/data/search", {
                    userid: this.props.user[0].userid,
                    searchFilename: this.state.searchText,
                    role: true
                }).then((res) => {
                    console.log(res.data)
                    this.setState({ userdata: res.data.data })
                }).catch(e => console.error(e))
            } else {
                axios.post("http://localhost:5000/pdf/data/search", {
                    userid: this.props.user[0].userid,
                    searchFilename: this.state.searchText
                }).then((res) => {
                    console.log(res.data)
                    this.setState({ userdata: res.data.data })
                }).catch(e => console.error(e))
            }
        }
    }
    render() {
        console.log(this.state.userdata)
        return (
            <div>
                <HomeNavbar navUser={this.props.user}></HomeNavbar>
                <div style={{ marginTop: "2rem" }}>
                    <Container>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="eg: filename.pdf"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                onChange={(e) => this.setState({ searchText: e.target.value })}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.searchText.bind(this)}>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Container>
                </div>

                <Container style={{ marginTop: "3rem" }}>

                    <div className="table">
                        <h3>List of uploaded PDF</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {this.props.user.length > 0 && this.props.user[0].userrole === "admin" ?
                                        <th>User Name</th> : null}
                                    <th>File Name</th>
                                    <th>Action</th>

                                </tr>
                            </thead>
                            <tbody>
                                {this.tableData()}

                            </tbody>
                        </Table>
                    </div>
                </Container>
            </div>
        )
    }
}
