import React from 'react';
import { HashRouter as Router, Navigate, Route, Routes, Link } from 'react-router-dom'
import './assets/styles/main.scss'

import HomePage from './views/HomePage';
import WapList from './views/WapList';
import WapEdit from './views/WapEdit';
import WapPreview from './views/WapPreview';

function App() {
  return (
    <Router>
      <section className="App">
        <nav className='app-header flex between' style={{ width: '400px' }}>
          <Link to='/website'>WapList</Link>
          <Link to='/website/1'>WapPreview</Link>
          <Link to='/website/1/edit'>WapEdit</Link>
        </nav>
        <Routes>
          <Route path='/website/:id/edit' element={<WapEdit />} />
          <Route path='/website/:id' element={<WapPreview />} />
          <Route path='/website' element={<WapList />} />
          <Route path='/' element={<HomePage />} />
        </Routes>
      </section>
    </Router>
  );
}

export default App;
