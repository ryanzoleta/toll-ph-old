'use client';

import InputLabel from './components/input-label';
import InputSelect from './components/input-select';
import tollways from '../data/tollways';
import points from '../data/points.json';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import feesMatrix from '../data/matrix-builder/matrix.json';
import Option from '@/types/option';
import Link from 'next/link';
import { formatToCurrency } from './utils';

export default function Home() {
  const { push } = useRouter();
  const [result, setResult] = useState(0);
  const [tollwayPoints, setTollwayPoints] = useState(tollways);
  const [entryPoints, setEntryPoints] = useState(
    points.points.filter((point) => !point.groups?.includes('EXIT_ONLY'))
  );
  const [exitPoints, setExitPoints] = useState(
    points.points.filter((point) => !point.groups?.includes('ENTRY_ONLY'))
  );
  const [selectedTollway, setSelectedTollway] = useState<Option | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<Option | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Option | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const matrix: any = feesMatrix;

  useEffect(() => {
    if (selectedTollway) {
      setEntryPoints(
        points.points.filter(
          (point) =>
            point.groups?.includes(selectedTollway?.id) && !point.groups?.includes('EXIT_ONLY')
        )
      );
      setExitPoints(
        points.points.filter(
          (point) =>
            point.groups?.includes(selectedTollway?.id) && !point.groups?.includes('ENTRY_ONLY')
        )
      );
      setResult(0);
    }
  }, [selectedTollway]);

  useEffect(() => {
    if (selectedOrigin && selectedTollway && matrix[selectedTollway.id][selectedOrigin.id]) {
      setExitPoints(
        points.points.filter(
          (point) =>
            Object.keys(matrix[selectedTollway.id][selectedOrigin.id]).includes(point.id) &&
            !point.groups?.includes('ENTRY_ONLY')
        )
      );
    } else if (selectedOrigin && selectedTollway) {
      // set;
    }
  }, [selectedOrigin, selectedTollway, matrix]);

  const handleCalculateClick = () => {
    if (selectedTollway && selectedOrigin && selectedDestination) {
      setResult(matrix[selectedTollway.id][selectedOrigin.id][selectedDestination.id]);
    }
  };

  const resetInput = () => {
    setSelectedTollway(null);
    setSelectedOrigin(null);
    setSelectedDestination(null);
    setResult(0);
    setIsSaved(false);
  };

  const saveResult = () => {
    setIsSaved(true);

    const resultToSave = {
      id: Date.now(),
      result: result,
      origin: selectedOrigin,
      destination: selectedDestination,
    };

    const localStorageResults = localStorage.getItem('results');

    if (localStorageResults) {
      const existingResults = JSON.parse(localStorageResults);
      localStorage.setItem('results', JSON.stringify([...existingResults, resultToSave]));
    } else {
      localStorage.setItem('results', JSON.stringify([resultToSave]));
    }
  };

  const unsaveResult = () => {
    setIsSaved(false);
  };

  return (
    <main className="just flex h-screen flex-col items-center overflow-scroll bg-slate-900 px-10 pb-10">
      <div className="flex w-full flex-col gap-12  md:w-8/12 lg:w-6/12 xl:w-4/12 2xl:w-3/12">
        <div className="mt-10 grid grid-cols-2">
          <Link href="/">
            <h1 className="text-4xl font-bold text-slate-700">toll.ph</h1>
          </Link>
          <div className="relative">
            <Link href="/saved">
              <button className="text-md absolute right-0 h-full text-right text-slate-700 hover:underline">
                Saved
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div>
            <InputSelect
              placeholder="Choose tollway"
              options={tollwayPoints}
              defaultSelectedOption={selectedTollway}
              label={<InputLabel text="Tollway" />}
              onSelectedChange={setSelectedTollway}
            />
          </div>
          <div>
            <InputSelect
              placeholder="Entry Point"
              options={entryPoints}
              defaultSelectedOption={selectedOrigin}
              label={<InputLabel text="From" />}
              onSelectedChange={setSelectedOrigin}
            />
          </div>
          <div>
            <InputSelect
              placeholder="Exit Point"
              options={exitPoints}
              defaultSelectedOption={selectedDestination}
              label={<InputLabel text="To" />}
              onSelectedChange={setSelectedDestination}
            />
          </div>
        </div>
        <div>
          <button
            className="w-full rounded-xl bg-green-900 py-4 text-lg font-bold text-green-400"
            onClick={handleCalculateClick}
          >
            Calculate
          </button>{' '}
          <button
            className="mt-3 w-full rounded-xl bg-slate-800 py-4 text-lg font-bold text-slate-500"
            onClick={resetInput}
          >
            Reset
          </button>
        </div>
        {result > 0 ? (
          <div className="flex flex-col gap-5">
            <div className="relative rounded-xl border border-solid border-slate-600 bg-slate-800 p-7">
              <p className="text-lg font-extralight text-slate-400">
                The toll fee from{' '}
                <span className="font-bold text-sky-600">{selectedOrigin?.description}</span> to{' '}
                <span className="font-bold text-sky-600">{selectedDestination?.description}</span>{' '}
                is
              </p>
              <h2 className="mt-4 text-5xl font-bold tracking-tight text-green-600">
                {formatToCurrency(result)}
              </h2>
              {isSaved ? (
                <p
                  className="text-md absolute bottom-5 right-5 cursor-pointer rounded-full p-2 text-slate-600 hover:underline"
                  onClick={unsaveResult}
                >
                  saved
                </p>
              ) : (
                <p
                  className="text-md absolute bottom-5 right-5 cursor-pointer rounded-full p-2 text-slate-600 hover:underline"
                  onClick={saveResult}
                >
                  save
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 px-5">
              <p className="text-md text-slate-600">
                Commuting to work on this route will cost on average{' '}
                <span className="font-bold text-slate-400">
                  {formatToCurrency(result * 2 * 20)}
                </span>{' '}
                per month
              </p>
              <p className="text-md text-slate-600">
                Commuting everyday on this route will cost on average{' '}
                <span className="font-bold text-slate-400">
                  {formatToCurrency(result * 2 * 30)}
                </span>{' '}
                per month
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
