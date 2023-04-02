import { useEffect, useRef, useState } from 'react';
import { Brewery } from './types';

import styles from './search.module.scss';

interface Test {
  label?: string;
}

const Search: React.FC<Test> = ({ label = "Search" }) => {
  // const fruits = ["Apple", "Apricot", "Orange", "Mango", "Banana", "Guava"]

  // Set initial states
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([] as Brewery[]);

  // Set refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLUListElement>(null);
  const searchResultRef = useRef<HTMLLIElement[]>([]);

  // Clear results on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (searchInputRef.current && !searchInputRef.current.contains(event.target as HTMLElement)) &&
        (searchResultsRef.current && !searchResultsRef.current.contains(event.target as HTMLElement))
      ) {
        clearSearchResults();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Brewery fetch
  const searchBreweries = async (query: string) => {
    const breweries = await fetch(`https://api.openbrewerydb.org/v1/breweries/search?query={${query}}`).then((res) => {
      return res.json();
    })

    setSearchResults(breweries);
  };

  // Handle input and results
  const handleSearchQuery = (query: string) => {
    // const results = fruits.filter((result) => result.toLowerCase().includes(query.toLowerCase()));
    // setSearchResults(results);
    setSearchInput(query);
    searchBreweries(query);
  };

  const handleSearchResult = (result: string) => {
    setSearchInput(result);
    alert('Execute search action…')
    clearSearchResults();
  };

  const clearSearchResults = () => {
    setSearchResults([]);
  };

  // Handle search key inputs
  const handleInputKeyDown = (e: React.KeyboardEvent,) => {
    switch (e.key) {
      case "Enter":
        alert('Execute search action…')
        break;
      case "ArrowDown":
        if (searchResultRef.current[0]) searchResultRef.current[0].focus();
        break;
    }
  };

  const handleResultsKeyDown = (result: string, e: React.KeyboardEvent, i: number) => {
    const prev = searchResultRef.current[i - 1];
    const next = searchResultRef.current[i + 1];
    const setInputFocus = () => {
      if (searchInputRef.current) searchInputRef.current.focus()
    };

    switch (e.key) {
      case "Escape":
        setInputFocus();
        break;
      case "Enter":
        handleSearchResult(result);
        break;
      case "ArrowDown":
        if (next) {
          next.focus();
        }
        break;
      case "ArrowUp":
        if (prev) {
          prev.focus();
        } else {
          setInputFocus();
        }
        break;
    }
  };

  return (
    <div className={styles["container"]}>
      <label className={styles["label"]}>{label}</label>
      <input
        className={styles["input"]}
        ref={searchInputRef}
        type="search" value={searchInput}
        onChange={(e) => handleSearchQuery(e.target.value)}
        onKeyDown={(e) => handleInputKeyDown(e)}
      />
      {!!searchResults.length &&
        <ul className={styles["results"]} ref={searchResultsRef}>
          {searchResults.map((result, i) => {
            return (
              <li
                className={styles["result"]}
                key={`${result}-${i}`}
                ref={(e) => { if (e) searchResultRef.current[i] = e }}
                tabIndex={0}
                onClick={() => handleSearchResult(result.name)}
                onKeyDown={(e) => handleResultsKeyDown(result.name, e, i)}
              >
                {result.name}
              </li>
            )
          })}
        </ul>
      }
    </div>
  );
}

export default Search;
