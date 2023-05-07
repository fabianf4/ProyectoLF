import { useState } from "react"
import { Container, Form, Button } from "react-bootstrap"
import connectionApi from "./axiosConf"
import Swal from "sweetalert2"

export default function Pag2() {
    const [postalCode, setPostalCode] = useState("")
    const [countryCode, setCountryCode] = useState("")
    const [countryName, setCountryName] = useState("")

    const [postalCodes, setPostalCodes] = useState("")
    const [countryCodes, setCountryCodes] = useState("")
    const [countryNames, setCountryNames] = useState("")

    function handleSubmit(e) {
        e.preventDefault()
        connectionApi
            .post("/createNewRule", {
                code: postalCode,
                countryCode: countryCode,
                countryName: countryName
            })
            .then((response) => {
                console.log(response)
                if (
                    response.data?.isOkLexico === false ||
                    response.data?.isOkSemantico === false ||
                    response.data?.isOkEstructural === false
                ) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        html: response.data?.msg
                    })
                } else {
                    Swal.fire({
                        icon: "success",
                        title: "Postal code",
                        html:
                            response.data?.msg +
                            "<br/> Regular expression: " +
                            response.data?.er +
                            "<br/> Rule: " +
                            response.data?.rule
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    html: "Error"
                })
            })
    }

    function handleSubmit2(e) {
        e.preventDefault()
        connectionApi
            .post("/createNewRule2", {
                codes: postalCodes,
                countryCode: countryCodes,
                countryName: countryNames
            })
            .then((response) => {
                console.log(response)

                Swal.fire({
                    icon: "success",
                    title: "Postal code",
                    html:
                        response.data?.msg +
                        "<br/> Regular expression: " +
                        response.data?.er +
                        "<br/> Rule: " +
                        response.data?.rule
                })
            })
            .catch((error) => {
                console.log(error)
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    html: "Error"
                })
            })
    }

    function validate(url, title) {
        console.log(url)
        connectionApi
            .post(url, {
                code: postalCode
            })
            .then((response) => {
                console.log(response)
                if (
                    response.data?.isOkLexico === false ||
                    response.data?.isOkSemantico === false ||
                    response.data?.isOkEstructural === false
                ) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        html: response.data?.msg
                    })
                } else {
                    Swal.fire({
                        icon: "success",
                        title: title,
                        html: response.data?.msg
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    html: "Error"
                })
            })
    }

    function generateRules() {
        Swal.fire({
            title: "Are you sure?",
            text: "This process may take a few minutes",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, generate rules!"
        }).then((result) => {
            if (result.isConfirmed) {
                connectionApi
                    .get("/generateAllPostalCodes")
                    .then((response) => {
                        console.log(response)
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            html: "Rules generated"
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            html: "Error"
                        })
                    })
            }
        })
    }

    return (
        <Container>
            <h1>Try and create postal codes</h1>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <p>
                        The syntax to create a new rule is: <br />
                        N for a number
                        <br />
                        L for a letter
                        <br />
                        ( to open an optional part
                        <br />
                        )? to close an optional part
                        <br />
                        _ for a blank space
                        <br />
                        - is a accepted character
                        <br />
                        It is important to leave a space between character and
                        character
                    </p>
                    <Form onSubmit={handleSubmit}>
                        <div className="row justify-content-start">
                            <div className="col-md-6">
                                <Form.Group controlId="formBasic">
                                    <Form.Label>Postal Code:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your postal code"
                                        value={postalCode}
                                        onChange={(e) =>
                                            setPostalCode(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="formBasic2">
                                    <Form.Label>Country Code:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your country code"
                                        value={countryCode}
                                        onChange={(e) =>
                                            setCountryCode(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="formBasic3">
                                    <Form.Label>Name of Country:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your country name"
                                        value={countryName}
                                        onChange={(e) =>
                                            setCountryName(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 d-flex align-items-end">
                                <Button type="submit" className="w-100">
                                    Create or update
                                </Button>
                            </div>
                        </div>
                    </Form>

                    <br />

                    <div className="row">
                        <div className="col-md-4 d-flex align-items-end">
                            <Button
                                className="w-100"
                                onClick={() =>
                                    validate(
                                        "/validateLexical",
                                        "The analysis lexical is valid"
                                    )
                                }
                            >
                                Validate lexic
                            </Button>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <Button
                                className="w-100"
                                onClick={() =>
                                    validate(
                                        "/validateSemantic",
                                        "The analysis semantic is valid"
                                    )
                                }
                            >
                                Validate semantic
                            </Button>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <Button
                                className="w-100"
                                onClick={() =>
                                    validate(
                                        "/validateStructural",
                                        "The analysis structural is valid"
                                    )
                                }
                            >
                                Validate structural
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <hr />

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <p>
                        Enter the postal codes and a new rule will be generated
                        that accepts them
                    </p>
                    <Form onSubmit={handleSubmit2}>
                        <div className="row justify-content-start">
                            <div className="col-md-6">
                                <Form.Group controlId="formBasic">
                                    <Form.Label>Postal Codes:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Enter your postal codes"
                                        value={postalCodes}
                                        onChange={(e) =>
                                            setPostalCodes(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="formBasic2">
                                    <Form.Label>Country Code:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your country code"
                                        value={countryCodes}
                                        onChange={(e) =>
                                            setCountryCodes(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="formBasic3">
                                    <Form.Label>Name of Country:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your country name"
                                        value={countryNames}
                                        onChange={(e) =>
                                            setCountryNames(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 d-flex align-items-end">
                                <Button type="submit" className="w-100">
                                    Create or update
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>

            <hr />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <Button onClick={() => generateRules()}>
                        Generate rules for all countries in the world
                    </Button>
                </div>
            </div>
            <hr />
        </Container>
    )
}
