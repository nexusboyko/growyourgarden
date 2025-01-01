import React from 'react';
import Garden from './Garden';
import Hero from './Hero';

function App() {
  return (
    <main className="relative h-screen w-screen font-inter">
      <Hero />
      <Garden tileMapping={{
        "rose": [[0, 0], [5, 5]],
        "sunflower": [[0, 1]],
      }} />
    </main>
  );
}

export default App;
