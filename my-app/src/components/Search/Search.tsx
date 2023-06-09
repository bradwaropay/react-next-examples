import { useContext, useEffect, useRef, useState } from 'react';
import StoreContext from '../../context/StoreContext';
import useDebounce from '../../hooks/debounce'
import { Brewery } from '../../types';
import styles from './search.module.scss';

interface SearchProps {
  label?: string;
}

const Search: React.FC<SearchProps> = ({ label = "Search Breweries" }) => {
  const { dispatch } = useContext(StoreContext);
  // Set initial states
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, 250);
  const [searchResults, setSearchResults] = useState([] as Brewery[]);

  // Set refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLUListElement>(null);
  const searchResultRef = useRef<HTMLLIElement[]>([]);

  // Brewery fetch
  const searchBreweries = async (query: string) => {
    const breweries = await fetch(`https://api.openbrewerydb.org/v1/breweries/autocomplete?query={${query}}`).then((res) => {
      return res.json();
    })

    // Manually limit to 15 results, API should be doing this automatically
    setSearchResults(breweries.slice(0, 15));
  };

  // Handle input and results
  const handleSearchQuery = (query: string) => {
    setSearchInput(query);
  };

  // Debounced search
  useEffect(() => {
    searchBreweries(debouncedSearchInput);
  }, [debouncedSearchInput])

  const handleSearchResult = (result: Pick<Brewery, 'id' | 'name'>) => {
    setSearchInput(result.name);
    dispatch({ type: "ADD", id: result.id, name: result.name });
    // alert('Execute search action…')
    clearSearchResults();
  };

  const clearSearchResults = () => {
    setSearchResults([]);
  };

  // Handle search key inputs
  const handleInputKeyDown = (e: React.KeyboardEvent,) => {
    switch (e.key) {
      case "Enter":
        // alert('Execute search action…')
        break;
      case "ArrowDown":
        e.preventDefault();
        if (searchResultRef.current[0]) searchResultRef.current[0].focus();
        break;
    }
  };

  const handleResultsKeyDown = (result: Pick<Brewery, 'id' | 'name'>, e: React.KeyboardEvent, i: number) => {
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
          e.preventDefault();
          next.focus();
        }
        break;
      case "ArrowUp":
        if (prev) {
          e.preventDefault();
          prev.focus();
        } else {
          setInputFocus();
        }
        break;
    }
  };

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

  return (
    <div className={styles["container"]}>
      <label className={styles["label"]}>{label}</label>
      <input
        className={styles["input"]}
        ref={searchInputRef}
        type="search" value={searchInput}
        onChange={(e) => handleSearchQuery(e.target.value)}
        onFocus={(e) => handleSearchQuery(e.target.value)}
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
                onClick={() => handleSearchResult(result)}
                onKeyDown={(e) => handleResultsKeyDown(result, e, i)}
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
