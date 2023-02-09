import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';
import axios from 'axios'
import './App.css';
import { useState } from 'react';




function App() {
  const [mynumero1, setMyNumero1] = useState(0)
  const [mynumero2, setMyNumero2] = useState(0)
  const [mysimbolo, setMySimbolo] = useState("")
  const [resultado, setResultado] = useState(0)
  const url = "http://localhost:8080/"

  async function calcular(e){
    e.preventDefault();
    
    const operacion = {
      numero1: mynumero1,
      numero2: mynumero2,
      simbolo: mysimbolo 
    }
    
    
    await axios.post(url + "calculate", operacion)
    .then(response =>{
      console.log(response) 
      setResultado(response.data.valor)
    }).catch(err =>{
      console.log(err)
    })
    
        /*
    fetch(url, requestPost)
      .then((response) => response.json())
      .then((data) => console.log(data))*/

    //console.log(operacion)
  }

  return (
      <div>
      <br></br>
      <Container>
      <Row>
        <Col>
          <h1>CALCULADORA</h1>
          <Form>
            <Stack direction="horizontal" gap={3}>
              <div className="bg-light" >

                <Form.Control style={{width:"220px",height: "125px",fontSize: "55px", borderRadius: "25px",boxShadow: "5px 5px 10px #888888"}} type="numbers" placeholder="0" onChange={(e) =>setMyNumero1(parseFloat(e.target.value))}/>
              </div>
              <div className="bg-light">
                <Form.Select style={{width:"100px",height: "100px",fontSize: "50px", borderRadius: "10px",boxShadow: "5px 5px 10px #888888"}} onChange={(e) =>setMySimbolo(e.target.value)}>
                  <option value="+">+</option>
                  <option value="-">-</option>
                  <option value="*">*</option>
                  <option value="/">/</option>
                </Form.Select>
              </div>
              <div className="bg-light">
                <Form.Control style={{width:"220px",height: "125px",fontSize: "55px", borderRadius: "25px",boxShadow: "5px 5px 10px #888888"}} type="numbers" placeholder="0" onChange={(e) =>setMyNumero2(parseFloat(e.target.value))} />
              </div>
            </Stack>
            <br></br>
            <Button variant="success" style={{width:"200px"}} size="lg" type="button" onClick={calcular}>
              Calcular
            </Button>          
          </Form>
          <br></br>
          <h3>RESULTADO:</h3>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control type="text" style={{fontSize:"55px", boxShadow: "5px 5px 10px #888888"}} value={resultado} readOnly />
            </Form.Group>
        </Col>
        <Col>
          <h1>LOGS</h1>
          <br></br>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td colSpan={2}>Larry the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default App;
