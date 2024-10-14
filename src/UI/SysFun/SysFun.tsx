import React from 'react';
import MathJax from 'react-mathjax2';

const SysFun = ({ coefficients, results }) => {
  if (!coefficients || !results || coefficients.length === 0 || results.length === 0) {
    return <p>Пожалуйста, введите уравнения.</p>;
  }

  // Generate the LaTeX representation of the equations
  const equations = `
    \\[
      \\begin{cases}
        ${coefficients.map((row, i) =>
          row.map((coef, j) =>
            `${coef !== 0 ? `${coef}${'x'}${j + 1}` : ''}`
          ).filter(term => term !== '').join(' + ') + ` = ${results[i]}`
        ).join(' \\\\ ')}
      \\end{cases}
    \\]
  `;

  return (
    <MathJax.Context input="tex">
      <div>
        <MathJax.Text text={equations} />
      </div>
    </MathJax.Context>
  );
}

export default SysFun;
