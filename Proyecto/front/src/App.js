import { Bar, Doughnut } from "react-chartjs-2";

import "./App.css";
import 'chart.js/auto';
import DataTable from "./Tabla";
import DataTableTop3 from "./TablaTop3";
import DataTableLast5 from "./TablaLast5";
import DougnutChart from "./DonaChart";
import BarChart from "./BarChart";

function App() {
  // Aquí puedes definir el estado y las funciones necesarias


  const barData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    datasets: [
      {
        label: 'Ventas por mes',
        data: [12, 19, 3, 5, 2, 3, 10],
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1
      }
    ]
  };

  // Opciones para el gráfico de barras
  const barOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  // Aquí está el JSX que representa la aplicación
  return (
    <div className="App-grid">
  {/* Sección 1 */}
  <div>
    <h2>Datos almacenados en Mysql</h2>
    <DataTable />
  </div>

  {/* Sección 2 */}
  <div>
    <h2>Top 3 Departamentos con mayor votos para presidente</h2>
    <DataTableTop3/>
  </div>

  {/* Sección 3 */}
  <div>
    <h2>Ultimos 5 votos en redis</h2>
    <DataTableLast5/>
  </div>

  {/* Sección 4 */}
  <div className="App-graficas">
    <div style={{margin: "5%"}}>
      <h2>Porcentaje de Votos</h2>
      <DougnutChart/>
    </div>
    <div style={{margin: "5%"}}>
      <h2>Sedes con mayores votos almacenados</h2>
      <BarChart/>
    </div>
  </div>

</div>
  
  );
}

export default App;
