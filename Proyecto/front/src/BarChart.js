import React, {useState,useEffect} from 'react'
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';

const BarChart = () =>{
    const [data, setData] = useState([])
    const [allData, setAllData] = useState([]);
    const [laabes, setLaabes] = useState([]);
    const [daata, setDaata] = useState([]);
    useEffect(()=>{
        const intervalId = setInterval(()=>{
            //Actualizo mi dashboard cada 3 seg
            const fetchData = async ()=>{
                const response = await fetch('http://34.133.149.148:3001/sedes')
                const jsonData = await response.json();
                const ids = jsonData.map(obj => obj.id);
                setLaabes(ids)
                const cts = jsonData.map(item => parseInt(item.count));
                setDaata(cts)
                setAllData(jsonData);
            };
            fetchData();
        },3000);
        return () => clearInterval(intervalId);
    },[]);

    const barData = {
        labels: laabes,
        datasets: [
          {
            label: 'Votos almacenados de cada sede',
            data: daata,
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 3
          }
        ]
      };

    // Opciones para el gráfico de barras
    const barOptions = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Número de votos'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Sedes'
            }
          }]
        }
      };
      

    return ( 
        <div>
            <Bar data={barData} options={barOptions}/>
            
        </div>
    )
}

export default BarChart;