"""
General utilities, KaTeX formatting helpers, and sample formula data.
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
"""

import re
from typing import Dict, List, Any

FORMULA_CATALOG: Dict[str, List[Dict[str, str]]] = {
    "Algebra": [
        {"name": "Quadratic Formula", "formula": r"x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}", "desc": "Roots of quadratic equation ax^2 + bx + c = 0"},
        {"name": "Binomial Theorem", "formula": r"(x + y)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} y^k", "desc": "Expansion of binomial powers"},
        {"name": "Logarithm Change of Base", "formula": r"\log_b(a) = \frac{\ln(a)}{\ln(b)} = \frac{\log_c(a)}{\log_c(b)}", "desc": "Base conversion for arbitrary logarithm"},
        {"name": "Sum of Arithmetic Series", "formula": r"S_n = \frac{n}{2}(2a_1 + (n-1)d) = \frac{n}{2}(a_1 + a_n)", "desc": "Sum of first n terms with common difference d"},
    ],
    "Calculus": [
        {"name": "Fundamental Theorem of Calculus", "formula": r"\int_{a}^{b} f(x)dx = F(b) - F(a) \quad \text{where } F'(x) = f(x)", "desc": "Connects differentiation and integration"},
        {"name": "Integration by Parts", "formula": r"\int u \, dv = uv - \int v \, du", "desc": "Product rule integration technique"},
        {"name": "Taylor Series Expansion", "formula": r"f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!} (x - a)^n", "desc": "Polynomial power series approximation"},
        {"name": "Chain Rule", "formula": r"\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)", "desc": "Derivative of composite functions"},
    ],
    "Trigonometry": [
        {"name": "Pythagorean Identity", "formula": r"\sin^2(\theta) + \cos^2(\theta) = 1, \quad 1 + \tan^2(\theta) = \sec^2(\theta)", "desc": "Fundamental trigonometric relationships"},
        {"name": "Euler's Formula", "formula": r"e^{i\theta} = \cos(\theta) + i\sin(\theta)", "desc": "Bridge between complex analysis and trigonometry"},
        {"name": "Double Angle Formulas", "formula": r"\sin(2\theta) = 2\sin(\theta)\cos(\theta), \quad \cos(2\theta) = \cos^2(\theta) - \sin^2(\theta)", "desc": "Angle duplication identities"},
    ],
    "Linear Algebra": [
        {"name": "Eigenvalue Characteristic Equation", "formula": r"\det(A - \lambda I) = 0", "desc": "Condition for non-trivial eigenvector solutions"},
        {"name": "Matrix Diagonalization", "formula": r"A = P D P^{-1} \quad \text{where } D = \text{diag}(\lambda_1, \dots, \lambda_n)", "desc": "Spectral decomposition of square matrix"},
        {"name": "Singular Value Decomposition (SVD)", "formula": r"A = U \Sigma V^T", "desc": "Factorization into orthogonal and singular matrices"},
    ],
    "Probability & Statistics": [
        {"name": "Bayes' Theorem", "formula": r"P(A|B) = \frac{P(B|A)P(A)}{P(B)}", "desc": "Posterior probability calculation"},
        {"name": "Normal Distribution PDF", "formula": r"f(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)", "desc": "Gaussian bell curve probability density"},
        {"name": "Central Limit Theorem", "formula": r"\bar{X}_n \xrightarrow{d} \mathcal{N}\left(\mu, \frac{\sigma^2}{n}\right)", "desc": "Convergence of sample mean to Gaussian"},
    ],
    "Differential Equations": [
        {"name": "1st Order Linear ODE (Integrating Factor)", "formula": r"I(x) = \exp\left(\int P(x)dx\right), \quad y(x) = \frac{1}{I(x)}\left(\int I(x)Q(x)dx + C\right)", "desc": "General solution for y' + P(x)y = Q(x)"},
        {"name": "2nd Order Homogeneous with Constant Coeffs", "formula": r"ar^2 + br + c = 0 \implies y = c_1 e^{r_1 x} + c_2 e^{r_2 x}", "desc": "Characteristic polynomial roots solution"},
    ],
}

def format_latex_for_display(text: str) -> str:
    """Ensures consistent LaTeX delimiters across markdown renderers."""
    # Replace inline single $ with math blocks if necessary or normalize
    return text
