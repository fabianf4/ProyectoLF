import { useState } from "react"
import Pag1 from "./Pag1"
import Pag2 from "./Pag2"
import Pag3 from "./Pag3"

import { Container, Button } from "react-bootstrap"

export default function App() {
    const [pag, setPag] = useState(0)

    return (
        <>
            <Container>
                {pag == 0 ? (
                    <>
                        <Button className="m-3" onClick={() => setPag(0)}>
                            Search postal code
                        </Button>
                        <Button className="m-3" onClick={() => setPag(1)}>
                            Add new rule
                        </Button>
                        <Button className="m-3" onClick={() => setPag(2)}>
                            List of postal codes
                        </Button>

                        <Pag1 />
                    </>
                ) : (
                    <></>
                )}
                {pag == 1 ? (
                    <>
                        <Button className="m-3" onClick={() => setPag(0)}>
                            Search postal code
                        </Button>
                        <Button className="m-3" onClick={() => setPag(1)}>
                            Add new rule
                        </Button>
                        <Button className="m-3" onClick={() => setPag(2)}>
                            List of postal codes
                        </Button>
                        <Pag2 />
                    </>
                ) : (
                    <></>
                )}
                {pag == 2 ? (
                    <>
                        <Button className="m-3" onClick={() => setPag(0)}>
                            Search postal code
                        </Button>
                        <Button className="m-3" onClick={() => setPag(1)}>
                            Add new rule
                        </Button>
                        <Button className="m-3" onClick={() => setPag(2)}>
                            List of postal codes
                        </Button>
                        <Pag3 />
                    </>
                ) : (
                    <></>
                )}
            </Container>
        </>
    )
}
