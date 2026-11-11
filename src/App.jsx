import { useState } from 'react';
import Background from './components/Background.jsx';
import Loader from './components/Loader.jsx';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import ProblemSolving from './components/ProblemSolving.jsx';
import Architecture from './components/Architecture.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Cursor />
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Background />
      <Nav />
      <main>
        {/* Hero mounts after the loader so its entrance animation is actually seen */}
        {loaded ? <Hero /> : <div className="min-h-screen" aria-hidden="true" />}
        <About />
        <Experience />
        <Projects />
        <Skills />
        <ProblemSolving />
        <Architecture />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
