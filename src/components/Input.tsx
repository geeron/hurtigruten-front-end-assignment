import e from 'express';
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// import magnifyingGlass from '../assets/magnifying-glass.svg';
// import cross from '../assets/cross.svg';

interface IProps {
  setSearchQuery: (val: string) => void;
  setShips: (val: []) => void;
  queryValue: string | null;
}

const Input: React.FC<IProps> = ({ setSearchQuery, setShips, queryValue }) => {
  let [searchParams, setSearchParams] = useSearchParams();

  //problems with imports of SVG's - related to typescript, will hack it this way
  const magnifyingGlass = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.5455 3.5C6.20666 3.5 3.5 6.20666 3.5 9.5455C3.5 12.8843 6.20666 15.591 9.5455 15.591C12.8843 15.591 15.591 12.8843 15.591 9.5455C15.591 6.20666 12.8843 3.5 9.5455 3.5ZM2.5 9.5455C2.5 5.65438 5.65438 2.5 9.5455 2.5C13.4366 2.5 16.591 5.65438 16.591 9.5455C16.591 13.4366 13.4366 16.591 9.5455 16.591C5.65438 16.591 2.5 13.4366 2.5 9.5455Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.101 14.1008C14.2963 13.9055 14.6129 13.9055 14.8081 14.1008L21.3536 20.6463C21.5489 20.8416 21.5489 21.1581 21.3536 21.3534C21.1584 21.5487 20.8418 21.5487 20.6465 21.3534L14.101 14.8079C13.9058 14.6126 13.9058 14.2961 14.101 14.1008Z"
      />
    </svg>
  );

  const cross = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.3536 4.64645C19.5488 4.84171 19.5488 5.15829 19.3536 5.35355L5.35355 19.3536C5.15829 19.5488 4.84171 19.5488 4.64645 19.3536C4.45118 19.1583 4.45118 18.8417 4.64645 18.6464L18.6464 4.64645C18.8417 4.45118 19.1583 4.45118 19.3536 4.64645Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.64645 4.64645C4.84171 4.45118 5.15829 4.45118 5.35355 4.64645L19.3536 18.6464C19.5488 18.8417 19.5488 19.1583 19.3536 19.3536C19.1583 19.5488 18.8417 19.5488 18.6464 19.3536L4.64645 5.35355C4.45118 5.15829 4.45118 4.84171 4.64645 4.64645Z"
      />
    </svg>
  );

  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [populated, setPopulated] = useState<boolean>(false);
  const [value, setValue] = useState<string>(queryValue!);

  const handleChange = (e: React.ChangeEvent<any>): void => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      setPopulated(true);
    } else {
      setPopulated(false);
    }
  };

  const isFocusing = (): void => {
    setInputFocused(true);
  };
  const notFocusing = (): void => {
    setInputFocused(false);
  };

  const clearInput = (e: React.ChangeEvent<any>): void => {
    e.preventDefault();
    // setValue('');
    // setSearchQuery('');
    setPopulated(false);
    setShips([]);
    setSearchParams('');
  };

  const handleSearch = () => {

    let sort = searchParams.get('sort');

    let newSearchParams;
    if (sort !== null) {
      newSearchParams = new URLSearchParams({ sort: sort, query: value });
    } else {
      newSearchParams = new URLSearchParams({ query: value });
    }
    setSearchQuery(value);
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    handleSearch();
  }, [value]);

  return (
    <form
      name="form"
      className={`m-2 flex w-full items-center shadow ${
        inputFocused ? 'border-blue-400' : 'border-grey-400'
      }  border-2 border-solid `}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        className="mx-2 w-full  py-4 px-2 focus:outline-none"
        type="text"
        placeholder="Search"
        value={value}
        onChange={handleChange}
        onFocus={isFocusing}
        onBlur={notFocusing}
      />
      {populated && (
        <button onClick={clearInput} className={` min-w-8 mx-2 transition-all`}>
          <span className="scale-125">{cross}</span>
        </button>
      )}
      <button
        className={`${
          populated ? ' bg-blue-700 text-white' : ''
        } min-w-32 relative ml-2 mt-[-1px] flex h-full flex-col items-center justify-center p-6 transition-all`}
        onClick={handleSearch}
      >
        <span className="scale-125">{magnifyingGlass}</span>
      </button>
    </form>
  );
};

export default Input;
