import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { POS } from './components/POS';
import { Sales } from './components/Sales';
import { Vendors } from './components/Vendors';
import { CRM } from './components/CRM';
import { Support } from './components/Support';

function App() {
  const [currentModule, setCurrentModule] = useState('dashboard');

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'pos':
        return <POS />;
      case 'sales':
        return <Sales />;
      case 'vendors':
        return <Vendors />;
      case 'crm':
        return <CRM />;
      case 'support':
        return <Support />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentModule={currentModule} onModuleChange={setCurrentModule}>
      {renderModule()}
    </Layout>
  );
}

export default App;
