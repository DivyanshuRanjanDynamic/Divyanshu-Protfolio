import { useDarkMode } from './hooks/useDarkMode';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Activity from './sections/Activity';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Achievements from './sections/Achievements';
import Contact from './sections/Contact';
import ChatWidget from './components/ChatWidget';

function App() {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar isDark={isDark} onToggleDark={toggle} />

      <main>
        <Hero isDark={isDark} />
        <About />
        <Skills />
        <Activity />
        <Experience />
        <Projects />
        <Achievements />
        <Contact />
      </main>

      <ChatWidget />

      <footer className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-dark-border">
        <p>
          Designed & Built by Divyanshu Ranjan
          <br />
        </p>
      </footer>
    </div>
  );
}

export default App;
