import React, {useState,useEffect} from 'react'
import {Doughnut} from 'react-chartjs-2';
import 'chart.js/auto';

const DougnutChart = () =>{
    const [data, setData] = useState([])
    const [allData, setAllData] = useState([]);
    useEffect(()=>{
        const intervalId = setInterval(()=>{
            //Actualizo mi dashboard cada 3 seg
            const fetchData = async ()=>{
                const response = await fetch('http://34.133.149.148:3001/porcentaje')
                const jsonData = await response.json();
                setAllData(jsonData);
            };
            fetchData();
        },3000);
        return () => clearInterval(intervalId);
    },[]);


    const chartData={
        labels:['Ran en uso', 'Ram libre'],
        datasets:[
            {
                label:'RAM MB',
                data: [100,100],
                
            }
        ]
    }


    const options = {
        plugins:{
            doughnutCenterText:{
                labels:[
                    {
                        text: 'Total:100%',
                        font: {
                            size:25,
                            weight: 'bold'
                        }
                    },
                    {
                        text:'AAAAAAAA',
                        font:{
                            size:'16',
                            weight:'normal'
                        }
                    }
                    
                ]
            }
        }
    };

    return ( 
        <div>
            <Doughnut data={chartData} options={options}/>
            <p className='chart-caption'>veamos is funciona</p>
        </div>
    )
}

export default DougnutChart;