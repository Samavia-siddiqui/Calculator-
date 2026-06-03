# 🧪 Glassmorphism Calculator

A beautiful, interactive, and highly polished **Glassmorphism Calculator** built using pure HTML, CSS, and JavaScript. It features modern frosted-glass visual aesthetics, premium fluid animations, robust arithmetic logic, and full physical keyboard support.

---

## ✨ Features

- **Premium Aesthetics**:
  - **Dynamic Background**: A slow-shifting gradient background (`linear-gradient` with `@keyframes` position transition).
  - **Frosted Glass (Glassmorphism)**: Developed using `backdrop-filter: blur`, subtle border lines, and micro transparent `rgba` backgrounds.
  - **Depth Effects**: Floating glowing background bubbles that drift slowly behind the main glass container, creating a beautiful 3D layered glass feel.
  - **Micro-interactions**: Subtle tactile press animations (`transform: scale(0.95)`) and operator highlighting.
- **Robust Math Engine**:
  - Full support for basic operations: addition (`+`), subtraction (`−`), multiplication (`×`), and division (`÷`).
  - Special helper functions: **AC** (clear all), **±** (sign toggler), and **%** (percentage divisor).
  - **Float Correction**: Avoids typical JavaScript floating-point errors (e.g., `0.1 + 0.2` outputs exactly `0.3` instead of `0.30000000000000004`).
  - **Live Expression Display**: Renders your active formula in a smaller, muted secondary screen above the main output result.
- **Physical Keyboard Support**:
  - Input digits directly from your keyboard.
  - Use `+`, `-`, `*`, `/` keys for operators.
  - Use `Enter` or `=` to calculate.
  - Use `Backspace` to delete the last typed digit.
  - Use `Escape` or `c`/`C` to clear all.
  - Use `.` or `,` to input decimals.
- **Responsive Web Design**: Fits comfortably on everything from desktop screens down to narrow mobile viewports.

---

## 🛠️ Tech Stack

* **Structure**: HTML5 (Semantic elements & ARIA labels)
* **Styling**: Vanilla CSS3 (Custom properties, grid, flexbox, keyframes, transitions)
* **Logic**: Vanilla ES6 JavaScript (No frameworks, pure event-driven architecture)

---

## 🚀 How to Run Locally

Since this project has zero external dependencies and uses pure web technologies, running it is extremely simple:

1. Clone this repository:
   ```bash
   git clone https://github.com/Samavia-siddiqui/Calculator-.git
   ```
2. Navigate to the project folder:
   ```bash
   cd Calculator-
   ```
3. Open `index.html` directly in your favorite web browser (double-click the file, or drag-and-drop it into the browser window).

---

## ⌨️ Keyboard Shortcuts Map

| Key | Calculator Button | Action |
| --- | --- | --- |
| `0` - `9` | `0` - `9` | Input Number |
| `.` or `,` | `.` | Decimal separator |
| `+` | `+` | Add |
| `-` | `−` | Subtract |
| `*` | `×` | Multiply |
| `/` | `÷` | Divide |
| `%` | `%` | Percentage division |
| `Enter` or `=` | `=` | Evaluate expression |
| `Backspace` | *N/A* | Delete last character |
| `Escape` or `c` / `C` | `AC` | Clear calculator |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to customize and extend it as you like!
