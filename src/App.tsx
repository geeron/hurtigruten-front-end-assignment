import React, { useState, useEffect } from 'react';
import Input from './components/Input';
import Table from './components/Table';
import { useSearchParams } from 'react-router-dom';

const App: React.FC = () => {
  const [ships, setShips] = useState<any[]>([]);

  let [searchParams, setSearchParams] = useSearchParams();
  let queryValue: any= searchParams.get('query');


  const [searchQuery, setSearchQuery] = useState<string | null>(queryValue);

  const getShips = (): void => {
    fetch('http://localhost:4000/api/ships/' + searchQuery)
      .then((res) => res.json())
      .then((data) => {
        setShips(data);

      })

      .catch(console.error);
  };

  useEffect(() => {
    if (searchQuery !== (null || '')) {
      getShips();
    }
  }, [searchQuery]);

  return (
    <main className=" my-4 mx-8 flex flex-col items-center justify-center sm:mx-32  md:mx-48 lg:mx-64">
      <Input setSearchQuery={setSearchQuery} queryValue={queryValue} setShips={setShips}></Input>
      <Table ships={ships} queryValue={queryValue}></Table>
    </main>
  );
};

export default App;
