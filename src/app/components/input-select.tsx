'use client';

import { ReactNode, useEffect, useState } from 'react';
import Option from '../../types/option';

type Props = {
  placeholder: string;
  options: Option[];
  label: ReactNode;
  defaultSelectedOption: Option | null;
  onSelectedChange?: (option: Option) => void;
};

function InputSelect({
  placeholder,
  options,
  label,
  defaultSelectedOption,
  onSelectedChange,
}: Props) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState<Option | null>(options[0]);
  const [inputText, setInputText] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (selectedOption && onSelectedChange) {
      onSelectedChange(selectedOption);
    }
  }, [selectedOption, onSelectedChange]);

  useEffect(() => {
    setFilteredOptions(options);
    setInputText('');
  }, [options]);

  useEffect(() => {
    if (defaultSelectedOption === null) setInputText('');
  }, [defaultSelectedOption]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputString = event.target.value;
    setInputText(inputString);

    const f = options.filter((option) =>
      option.description.toUpperCase().includes(inputString.toUpperCase())
    );

    setFilteredOptions(f.length > 0 ? f : options);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      if (hoveredIndex >= 0) {
        setSelectedOption(filteredOptions[hoveredIndex]);
        setInputText(filteredOptions[hoveredIndex].description);
      }
      event.currentTarget.blur();
    } else if (event.key == 'ArrowDown' && hoveredIndex + 1 < filteredOptions.length) {
      setHoveredIndex(hoveredIndex + 1);
    } else if (event.key == 'ArrowUp' && hoveredIndex > 0) {
      setHoveredIndex(hoveredIndex - 1);
    } else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(event.key.toUpperCase())) {
      setHoveredIndex(-1);
    }
  };

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    setInputText(option.description);
  };

  const handleOnBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setIsSelecting(false);
      setHoveredIndex(-1);
      if (event.target.value !== '') {
        if (
          options.find((option) => {
            return option.description === event.target.value;
          }) === undefined
        ) {
          setIsError(true);
        } else {
          setIsError(false);
        }
      } else {
        setIsError(false);
      }
    }, 100);
  };

  const optionSelector = (
    <div className="absolute z-50 mt-3 max-h-96 w-full overflow-scroll rounded-lg bg-slate-800">
      {filteredOptions.map((option, index) => {
        return (
          <div
            key={option.id}
            onClick={() => {
              handleSelectOption(option);
            }}
            onMouseEnter={() => {
              setHoveredIndex(index);
            }}
            className={'text-md  px-5 py-3 text-slate-400 hover:z-10 hover:cursor-pointer hover:bg-slate-700 '
              .concat(' ')
              .concat(index == hoveredIndex ? 'bg-slate-700' : '')
              .concat(' ')
              .concat(index == hoveredIndex && index == 0 ? 'rounded-t-lg' : '')
              .concat(' ')
              .concat(
                index == hoveredIndex && index == filteredOptions.length - 1 ? 'rounded-b-lg' : ''
              )
              .concat(' ')
              .concat(index == 0 ? 'hover:rounded-t-lg' : '')
              .concat(' ')
              .concat(index == filteredOptions.length - 1 ? 'hover:rounded-b-lg' : '')}
          >
            {option.description}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2">
        <div>{label}</div>
        <div className="relative">
          {isError ? (
            <p className="absolute bottom-0 right-0 text-right text-sm text-red-800 ">Invalid</p>
          ) : null}
        </div>
      </div>
      <div className="relative w-full">
        <input
          className={'w-full rounded-md border border-solid border-slate-600 bg-slate-700 px-5 py-3 text-lg text-slate-400 placeholder-slate-600'
            .concat(' ')
            .concat(isError ? 'border-red-800' : '')}
          type="text"
          placeholder={placeholder}
          onFocus={() => {
            setIsSelecting(true);
          }}
          onBlur={handleOnBlur}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={inputText}
        />
        {isSelecting ? optionSelector : null}
      </div>
    </div>
  );
}

export default InputSelect;
