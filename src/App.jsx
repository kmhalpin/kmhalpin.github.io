import React from 'react';
import {
  Routes, Route, Link, BrowserRouter,
} from 'react-router-dom';
import EdgeDetection from './components/EdgeDetection';
import HoughTransformation from './components/HoughTransformation';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="edge-detection-sobel">Edge Detection (Sobel)</Link>
        {' '}
        <Link to="edge-detection-prewitt">Edge Detection (Prewitt)</Link>
        {' '}
        <Link to="hough-transformation">Hough Transformation</Link>
      </nav>
      <Routes>
        <Route path="/" element={<p>Welcome</p>} />
        <Route path="edge-detection-sobel" element={<EdgeDetection mask={2.0} />} />
        <Route path="edge-detection-prewitt" element={<EdgeDetection mask={1.0} />} />
        <Route path="hough-transformation" element={<HoughTransformation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
