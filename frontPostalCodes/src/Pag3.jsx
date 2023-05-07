import { useEffect, useState } from "react"
import connectionApi from "./axiosConf"
import {Table} from "react-bootstrap"

export default function Pag3() {
    const [data, setData] = useState({})

    useEffect(() => {
        connectionApi
            .get("/getRules")
            .then((response) => {
                setData(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        <>
            <h1>List of postal codes</h1>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Country Code</th>
                        <th>Name</th>
                        <th>Regular Expresion</th>
                        <th>Rule</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.country_code}</td>
                                    <td>{item.name}</td>
                                    <td>{item.er}</td>
                                    <td>{item.rule}</td>
                                </tr>
                            )
                        })
                    ) : (
                        <p>There are no postal codes</p>
                    )}
                </tbody>
            </Table>
        </>
    )
}
