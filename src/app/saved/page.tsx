'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { formatToCurrency } from '../utils';
import Option from '@/types/option';

type Props = {};

type Result = {
  id: number;
  result: number;
  origin: Option;
  destination: Option;
};

function SavedPage({}: Props) {
  const [savedResults, setSavedResults] = useState<Array<Result>>([]);

  useEffect(() => {
    const localStorageResults = localStorage.getItem('results');

    if (localStorageResults) {
      setSavedResults(JSON.parse(localStorageResults));
    }
  }, []);

  const unsaveResult = (id: number) => {
    const newSavedResults = savedResults.filter((r) => {
      return r.id !== id;
    });

    setSavedResults(newSavedResults);

    localStorage.setItem('results', JSON.stringify(newSavedResults));
  };

  return (
    <main className="just flex h-screen flex-col items-center bg-slate-900 px-10">
      <div className="flex w-full flex-col gap-12  md:w-8/12 lg:w-6/12 xl:w-4/12 2xl:w-3/12">
        <div className="mt-10 grid grid-cols-2">
          <Link href="/">
            <h1 className="text-4xl font-bold text-slate-700">toll.ph</h1>
          </Link>{' '}
          <div className="relative">
            <Link href="/saved">
              <button className="text-md absolute right-0 h-full text-right text-slate-700 hover:underline">
                Saved
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {savedResults.map((savedResult) => {
            return (
              <div
                key={savedResult.origin.id.concat(savedResult.destination.id)}
                className="relative rounded-xl border border-solid border-slate-600 bg-slate-800 p-7"
              >
                <p className="text-lg font-extralight text-slate-400">
                  The toll fee from{' '}
                  <span className="font-bold text-sky-600">{savedResult.origin.description}</span>{' '}
                  to{' '}
                  <span className="font-bold text-sky-600">
                    {savedResult.destination.description}
                  </span>{' '}
                  is
                </p>
                <h2 className="mt-4 text-5xl font-bold tracking-tight text-green-600">
                  {formatToCurrency(savedResult.result)}
                </h2>
                <p
                  className="text-md absolute bottom-5 right-5 cursor-pointer rounded-full p-2 text-slate-600 hover:underline"
                  onClick={() => {
                    unsaveResult(savedResult.id);
                  }}
                >
                  remove
                </p>
              </div>
            );
          })}
          {savedResults.length === 0 ? (
            <p className="text-center text-slate-700">Your saved routes will go here!</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default SavedPage;
