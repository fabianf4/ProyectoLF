import { useState } from "react"
import { Container } from "react-bootstrap"
import { Form, Button, Alert, Card } from "react-bootstrap"
import connectionApi from "./axiosConf"

function Pag1() {
    const [postalCode, setPostalCode] = useState("")
    const [data, setData] = useState()
    const [msgValid, setMsgValid] = useState(false)
    const [postalCodesGet, setPostalCodesGet] = useState({})

    function handleSubmit(e) {
        e.preventDefault()
        connectionApi
            .get(`/validateCode/${postalCode}`)
            .then((response) => {
                console.log(response)
                setData(response.data)
                if (!response?.data?.message) {
                    connectionApi
                        .get(`/postalCodeGet/${postalCode}`)
                        .then((response) => {
                            console.log(response)
                            if (response?.data?.message) {
                                console.log("No hay datos")
                                setPostalCodesGet({})
                            } else {
                                console.log("Hay datos")
                                setPostalCodesGet(response.data)
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            })
            .catch((error) => {
                console.log(error)
            })

        setMsgValid(true)
    }

    return (
        <>
            <Container >
                <h1>Postal Codes</h1>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <Form onSubmit={handleSubmit}>
                            <div className="row justify-content-start">
                                <div className="col-md-8">
                                    <Form.Group controlId="formBasic">
                                        <Form.Label>Postal Code:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter postal code"
                                            value={postalCode}
                                            onChange={(e) =>
                                                setPostalCode(e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4 d-flex align-items-end">
                                    <Button type="submit" className="w-100">
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
                <br />
                {msgValid ? (
                    data?.message ? (
                        <Alert key="danger" variant="danger">
                            {data.message}
                        </Alert>
                    ) : (
                        <>
                            <Alert key="success" variant="success">
                                The postal code is valid in:
                                {data ? (
                                    Object.keys(data).map((key) => (
                                        <div key={key}>{data[key].name}</div>
                                    ))
                                ) : (
                                    <>No data</>
                                )}
                            </Alert>

                            {Object.keys(postalCodesGet).length !== 0 ? (
                                <div className="row justify-content-center gap-3">
                                    {postalCodesGet.map((item) => (
                                        <Card
                                            style={{ width: "45%" }}
                                            key={item.id}
                                        >
                                            <iframe
                                                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15057.534307180755!2d${item.longitude}5!3d${item.latitude}5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2smx!4v1651103744472!5m2!1sen!2smx`}
                                                width="100%"
                                                height="300"
                                                //allowfullscreen=""
                                                loading="lazy"
                                                //referrerpolicy="no-referrer-when-downgrade"
                                            ></iframe>
                                            <Card.Body>
                                                <Card.Title>
                                                    {item.place_name}
                                                </Card.Title>
                                                <Card.Text>
                                                    <li>
                                                        Postal Code:{" "}
                                                        {item.postal_code}
                                                    </li>
                                                    <li>
                                                        Country:{" "}
                                                        {
                                                            data[
                                                                item.country_code
                                                            ]?.name
                                                        }
                                                    </li>
                                                    {
                                                        item.admin_name1 !== "None" ? (
                                                            <li>
                                                                Code of {item.admin_name1}:{" "}{item.admin_code1}
                                                            </li>
                                                        ):(
                                                            <></>
                                                        )
                                                    }
                                                    {
                                                        item.admin_name2 !== "None" ? (
                                                            <li>
                                                                Code of {item.admin_name2}:{" "}{item.admin_code2}
                                                            </li>
                                                        ):(
                                                            <></>
                                                        )
                                                    }
                                                    {
                                                        item.admin_name3 !== "None" ? (
                                                            <li>
                                                                Code of {item.admin_name3}:{" "}{item.admin_code3}
                                                            </li>
                                                        ):(
                                                            <></>
                                                        )
                                                    }
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <Alert key="danger" variant="danger">
                                        Postal code don't found:{" "}
                                        {postalCode}
                                    </Alert>
                                </>
                            )}
                        </>
                    )
                ) : (
                    <></>
                )}
            </Container>
        </>
    )
}

export default Pag1
