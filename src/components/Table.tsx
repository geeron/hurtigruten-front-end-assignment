import React, { useState, useEffect, ReactEventHandler } from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Link, useSearchParams } from 'react-router-dom';

//import downArrow from './assets/down-arrow.svg'

interface IProps {
  ships: any[];
  queryValue: string;
}

//problems with svg typescript imports
const downArrow = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.8536 11.8536C15.6583 12.0488 15.3417 12.0488 15.1464 11.8536L8 4.70711L0.853554 11.8536C0.658291 12.0488 0.341709 12.0488 0.146446 11.8536C-0.0488167 11.6583 -0.0488166 11.3417 0.146446 11.1464L7.64645 3.64645C7.84171 3.45118 8.15829 3.45118 8.35355 3.64645L15.8536 11.1464C16.0488 11.3417 16.0488 11.6583 15.8536 11.8536Z"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(16 16) rotate(-180)"
        />
      </clipPath>
    </defs>
  </svg>
);

const Table: React.FC<IProps> = ({ ships, queryValue }) => {
  let [searchParams] = useSearchParams();
  let [sortProp, desc]: string[] = searchParams.get('sort')?.split(':') ?? [];

  const [sortedShips, setSortedShips] = useState<any>([]);

  const collapseAll = () => {
    setExpandedShips([]);
  };

  const getShipId = (e: React.ChangeEvent<any>) => {
    let shipId = e.target.getAttribute('ship-id');
    if (!shipId) {
      return;
    }
    let index = expandedShips.indexOf(shipId);
    if (index === -1) {
      setExpandedShips([...expandedShips, shipId]);
    } else {
      if (expandedShips.length < 2) {
        setExpandedShips([]);
      } else {
        let newArr = [...expandedShips];
        newArr.splice(index, 1);
        setExpandedShips(newArr);
      }
    }
  };

  const [expandedShips, setExpandedShips] = useState<string[]>([]);

  useEffect(() => {
    setSortedShips(
      [...ships].sort((a: any, b: any) => {
        return desc
          ? b[sortProp]?.localeCompare(a[sortProp])
          : a[sortProp]?.localeCompare(b[sortProp]);
      })
    );
  }, [searchParams]);

  useEffect(() => {
    setSortedShips([...ships]);
    collapseAll();
  }, [ships]);

  return (
    <div className="mx-auto w-full">
      <div className="">
        <div className="mt-8 flex flex-col">
          <div className="my-2 overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="border-grey-400 overflow-hidden border-2 border-solid shadow">
                <table className="min-w-full ">
                  <thead className="bg-gray-50">
                    <tr>
                      <th>
                        {' '}
                        {expandedShips.length > 0 && (
                          <button onClick={collapseAll}>
                            {' '}
                            <ChevronDownIcon
                              className={`${
                                expandedShips.length > 0 ? 'rotate-180' : ''
                              } h-5 w-5`}
                              aria-hidden="true"
                            />
                          </button>
                        )}
                      </th>
                      <SortableColumn queryValue={queryValue} prop="shipId">
                        ID
                      </SortableColumn>
                      <SortableColumn queryValue={queryValue} prop="heading">
                        Name
                      </SortableColumn>
                      <SortableColumn
                        queryValue={queryValue}
                        prop="passengerCapacity"
                      >
                        Passengers
                      </SortableColumn>
                      <SortableColumn
                        queryValue={queryValue}
                        prop="yearOfConstruction"
                      >
                        Built
                      </SortableColumn>
                    </tr>
                  </thead>
                  {sortedShips.map((ship: any) => (
                    <tbody
                      key={ship.shipId}
                      className="divide-y divide-gray-200 bg-white"
                    >
                      <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <button onClick={getShipId} ship-id={ship.shipId}>
                            {' '}
                            <ChevronDownIcon
                              ship-id={ship.shipId}
                              className={`${
                                expandedShips.indexOf(ship.shipId) > -1
                                  ? 'rotate-180'
                                  : ''
                              } h-5 w-5`}
                              aria-hidden="true"
                            />
                          </button>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {ship.shipId}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ship.heading}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ship.passengerCapacity}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ship.yearOfConstruction}
                        </td>
                      </tr>
                      {expandedShips.indexOf(ship.shipId) > -1 && (
                        <tr className="">
                          <td
                            colSpan={100}
                            className="prose py-4 text-center  md:max-w-2xl"
                            dangerouslySetInnerHTML={{
                              __html: ship.body
                                ? ship.body
                                    .split('class=')
                                    .join('className=')
                                    .split('\n')[0]
                                : ''
                            }}
                          ></td>
                        </tr>
                      )}
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ISortableColumn {
  prop: any;
  children: any;
  queryValue: string;
}

const SortableColumn: React.FC<ISortableColumn> = ({
  prop,
  children,
  queryValue
}) => {
  let [searchParams, setSearchParams] = useSearchParams();
  let [sortProp, desc] = searchParams.get('sort')?.split(':') ?? [];
  let newSort = null;

  const buttonHandler = () => {
    if (sortProp !== prop) {
      newSort = prop;
      setSearchParams({ sort: newSort, query: queryValue });
    } else if (sortProp === prop && !desc) {
      newSort = `${prop}:desc`;
      setSearchParams({ sort: newSort, query: queryValue });
    } else {
      setSearchParams({ sort: '', query: queryValue });
    }
  };

  return (
    <th
      scope="col"
      className="py-3.5 px-3 text-left text-sm text-gray-900 first:pl-4 first:sm:pl-6"
    >
      <button
        onClick={buttonHandler}
        className="group inline-flex font-semibold"
      >
        {children}
        <span
          className={`${
            sortProp === prop
              ? 'bg-gray-200 text-gray-900 group-hover:bg-gray-300'
              : 'invisible text-gray-400 group-hover:visible'
          } ml-2 flex-none rounded`}
        >
          <ChevronDownIcon
            className={`${desc ? 'rotate-180' : ''} h-5 w-5`}
            aria-hidden="true"
          />
        </span>
      </button>
    </th>
  );
};

export default Table;
