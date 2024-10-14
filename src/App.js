import SysFun from "./UI/SysFun/SysFun.tsx";
import classes from "./App.module.css";
import FunButt from "./UI/FunButt/FunButt.tsx";
import FindPiInput from "./UI/Input/FindPiInput.jsx";
import { useState } from "react";
import Plot from 'react-plotly.js';

function App() {
  const [rows, setRows] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [coefficients, setCoefficients] = useState([]);
  const [results, setResults] = useState([]);
  const [solution, setSolution] = useState(null);
  const [plotData, setPlotData] = useState([]);

  const renderTable = () => {
    const coefficientRows = [];
    const resultRows = [];

    for (let i = 0; i < rows; i++) {
      const coefficientColumns = [];
      for (let j = 0; j < rows; j++) {
        coefficientColumns.push(
          <td key={j} style={{ textAlign: 'center', width: '50px', height: '30px' }}>
            <input
              type="number"
              style={{ textAlign: 'center', width: '50px', height: '30px' }}
              onChange={(e) => {
                const newCoefficients = [...coefficients];
                if (!newCoefficients[i]) newCoefficients[i] = [];
                newCoefficients[i][j] = parseFloat(e.target.value) || 0;
                setCoefficients(newCoefficients);
              }}
            />
          </td>
        );
      }
      coefficientRows.push(<tr key={i}>{coefficientColumns}</tr>);

      resultRows.push(
        <tr key={i}>
          <td style={{ textAlign: 'center', width: '30px' }}>=</td>
          <td style={{ textAlign: 'center', width: '50px', height: '30px' }}>
            <input
              type="number"
              style={{ textAlign: 'center', width: '50px', height: '30px' }}
              onChange={(e) => {
                const newResults = [...results];
                newResults[i] = parseFloat(e.target.value) || 0;
                setResults(newResults);
              }}
            />
          </td>
        </tr>
      );
    }

    return (
      <div>
        <table style={{ display: 'inline', borderCollapse: 'collapse' }}>
          <tbody>{coefficientRows}</tbody>
        </table>
        <table style={{ display: 'inline', borderCollapse: 'collapse', marginLeft: '20px' }}>
          <tbody>{resultRows}</tbody>
        </table>
      </div>
    );
  };

  const handleButtonClick = () => {
    setShowTable(!showTable);

  };

  const solveSystem = () => {
    // Проверка на корректность ввода коэффициентов
    for (let i = 0; i < rows; i++) {
      if (!coefficients[i] || coefficients[i].length !== rows) {
        alert(`Пожалуйста, убедитесь, что все коэффициенты введены для строки ${i + 1}.`);
        return;
      }
      for (let j = 0; j < rows; j++) {
        if (typeof coefficients[i][j] !== 'number' || isNaN(coefficients[i][j])) {
          alert(`Некорректное значение коэффициента в строке ${i + 1}, столбце ${j + 1}.`);
          return;
        }
      }
    }

    // Проверка на корректность ввода результатов
    for (let i = 0; i < rows; i++) {
      if (typeof results[i] !== 'number' || isNaN(results[i])) {
        alert(`Некорректное значение результата в строке ${i + 1}.`);
        return;
      }
    }

    // Решение методом Гаусса
    try {
      const n = coefficients.length;
      const matrix = coefficients.map(row => [...row]); 
      const b = [...results]; 

      // Прямой ход
      for (let i = 0; i < n; i++) {
        if (matrix[i][i] === 0) {
          alert(`На диагонали матрицы обнаружен ноль в строке ${i + 1}, возможно, система вырожденная.`);
          return;
        }

        for (let j = i + 1; j < n; j++) {
          const factor = matrix[j][i] / matrix[i][i];
          for (let k = i; k < n; k++) {
            matrix[j][k] -= factor * matrix[i][k];
          }
          b[j] -= factor * b[i];
        }
      }

      // Обратный ход
      const solution = new Array(n);
      for (let i = n - 1; i >= 0; i--) {
        let sum = b[i];
        for (let j = i + 1; j < n; j++) {
          sum -= matrix[i][j] * solution[j];
        }
        solution[i] = sum / matrix[i][i];
      }

      setSolution(solution);
      generatePlotData(solution); 
    } catch (error) {
      alert("Ошибка при решении системы: " + error.message);
    }
  };

  const generatePlotData = (solution) => {
    const traces = [];
    
    for (let i = 0; i < rows; i++) {
      const a = coefficients[i];
      const b = results[i];
      const x = [];
      const y = [];

      // Генерация точек для plotа
      for (let xValue = -10; xValue <= 10; xValue += 1) {
        const yValue = (b - a[0] * xValue) / a[1]; // Rearranging ax + by = c to y = (c - ax) / b
        x.push(xValue);
        y.push(yValue);
      }

      traces.push({
        x: x,
        y: y,
        mode: 'lines',
        name: `Уравнение ${i + 1}`,
      });
    }

    // Решения уравнений. Верт линии ЙОУ
    solution.forEach((sol, index) => {
      traces.push({
        x: [sol, sol],
        y: [-10, 10], 
        mode: 'lines',
        name: `x${index + 1} = ${sol.toFixed(2)}`,
        line: { color: 'red', width: 2, dash: 'dash' },
      });
    });

    setPlotData(traces);
  };

  return (
    
    <div className={classes["App"]}>
        <p style={{fontWeight:'500', margin:'10px 0 30px 0'}}>Да простит меня Господь за недекомпозиционное приложение</p>

      <div className={classes["steps"]}>
        <p>Введите количество уравнений:</p>
        <FindPiInput onChange={(e) => setRows(Number(e.target.value))} disabled={showTable} />
        <FunButt onClick={handleButtonClick} >Перейти к вводу коэффициентов</FunButt>
        {showTable && (
          <div>
            {renderTable()}
          </div>
        )}
      </div>
      <SysFun coefficients={coefficients} results={results} />

      <FunButt onClick={solveSystem}>Решить СЛАУ</FunButt>
      {solution && (
        <div>
          <h3>Решение:</h3>
          <p>{solution.map((sol, index) => `x${index + 1} = ${sol.toFixed(2)}`).join(', ')}</p>
        </div>
      )}
      {plotData.length > 0 && (
        <Plot
          data={plotData}
          layout={{
            title: 'Графическое решение уравнений',
            xaxis: { title: 'x' },
            yaxis: { title: 'y' },
            showlegend: true,
            yaxis: {
              range: [-10, 10], 
            },
          }}
          style={{ width: "100%", height: "50%" }}
        />
      )}
    </div>
  );
}

export default App;
