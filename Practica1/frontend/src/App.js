import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';
import axios from 'axios'
import './App.css';
import { useEffect, useState } from 'react';




function App() {
  const [mynumero1, setMyNumero1] = useState(0)
  const [mynumero2, setMyNumero2] = useState(0)
  const [mysimbolo, setMySimbolo] = useState("+")
  const [resultado, setResultado] = useState(0)
  const [dataTable, setDataTable] = useState([])
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
      viewTable()
      document.getElementById("inputNumero1").value = ""
      document.getElementById("inputNumero2").value = ""
      
    }).catch(err =>{
      console.log(err)
    })
    
  }

  function limpiar(){
    document.getElementById("inputNumero1").value = ""
    document.getElementById("inputNumero2").value = ""
    document.getElementById("inputResultado").value = ""  
    setResultado("")
  }

  async function viewTable(){
    await axios.get(url + "logs")
    .then(response =>{
      setDataTable(response.data)
    }).catch(err =>{
      console.log(err)
    })
  }


  useEffect(() =>{
    viewTable()
  }, [])

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

                <Form.Control id="inputNumero1" style={{width:"220px",height: "125px",fontSize: "55px", borderRadius: "25px",boxShadow: "5px 5px 10px #888888"}} type="numbers" placeholder="0" onChange={(e) =>setMyNumero1(parseFloat(e.target.value))}/>
              </div>
              <div className="bg-light">
                <Form.Select style={{width:"100px",height: "100px",fontSize: "50px", borderRadius: "10px",boxShadow: "5px 5px 10px #888888"}} onChange={(e) =>setMySimbolo(e.target.value)}>
                  <option value="+">+</option>
                  <option value="-">-</option>
                  <option value="*">*</option>
                  <option value="/">/</option>
                </Form.Select>
              </div>
              <div className="bg-light" >
                <Form.Control id="inputNumero2" style={{width:"220px",height: "125px",fontSize: "55px", borderRadius: "25px",boxShadow: "5px 5px 10px #888888"}} type="numbers" placeholder="0" onChange={(e) =>setMyNumero2(parseFloat(e.target.value))} />
              </div>
            </Stack>
            <br></br>
            <Button variant="success" style={{width:"200px"}} size="lg" type="button" onClick={calcular}>
              Calcular
            </Button>
            <Button variant="info" style={{width:"200px", margin: "10px"}} size="lg" type="button" onClick={limpiar}>
              Limpiar
            </Button>         
          </Form>
          <br></br>
          <h3>RESULTADO:</h3>
            <Form.Group className="mb-3">
              <Form.Control id="inputResultado" type="text" style={{fontSize:"55px", boxShadow: "5px 5px 10px #888888"}} value={resultado} readOnly />
            </Form.Group>
        </Col>
        <Col>
          <h1>LOGS</h1>
          <br></br>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>NUMERO 1</th>
                <th>NUMERO 2</th>
                <th>SIMBOLO</th>
                <th>RESULTADO</th>
                <th>FECHA</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.map(op =>{
                var dateTimeop = op.fecha
                var newDatetimeOp = new Date(dateTimeop)
                newDatetimeOp.setHours(newDatetimeOp.getHours() - 6)
                return (
                  
                  <tr key={op.id}>
                    <td>{op.id}</td>
                    <td>{op.numero1}</td>
                    <td>{op.numero2}</td>
                    <td>{op.simbolo}</td>
                    <td>{op.resultado}</td>
                    <td>{newDatetimeOp.toLocaleString('es-GT')}</td> 
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default App;
