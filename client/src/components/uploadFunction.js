import React, { useState } from 'react'
import { Navbar, Button, Modal, Form } from "react-bootstrap"
import axios from "axios"

export default function UploadFunction(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [file, setFile] = useState({});
    const [fileRetrun, setFileReturn] = useState({});
    const [uoloadtxt, setUploadText] = useState(false);


    const uploadPDF = (e) => {
        e.preventDefault()

        console.log(file)
        // let filename = e.target.files[0]
        const formData = new FormData()

        formData.append('pdffile', file)

        axios.post("http://localhost:5000/api/upload",
            formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then((res) => {
            e.preventDefault()
            setUploadText(true)
            console.log(res)
            setFileReturn(res)
        }).catch(e => console.error(e))


    }

    const savePdf = (e) => {
        e.preventDefault()

        console.log(fileRetrun)
        axios.post("http://localhost:5000/pdf/add", {
            userid: props.userDetails[0].userid,
            pdfpath: fileRetrun.data.filePath,
            pdfname: fileRetrun.data.fileName
        }).then((res) => {
            console.log(res)
            handleClose()
        }).catch(e => console.log(e))
    }

    return (
        <div style={{ marginRight: "2rem" }}>
            <Button variant="primary" onClick={handleShow}>
                Upload pdf
        </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload PDF</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.File id="exampleFormControlFile1" onChange={(e) => setFile(e.target.files[0])} />
                        </Form.Group>
                        <Button variant="secondary" type="submit" onClick={uploadPDF}>
                            Upload
                        </Button>
                        <span style={{ marginLeft: "20px", color: "green" }}>{uoloadtxt ? "Uploaded" : null}</span>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" type="submit" onClick={(e) => savePdf(e)}>

                        Save
            </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
            </Button>

                </Modal.Footer>
            </Modal>
        </div >
    );
}
