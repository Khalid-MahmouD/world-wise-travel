import { useContext, useReducer } from "react";
import { createContext, useEffect } from "react";
const BASE_URL = "http://localhost:8000";


const initialState = {
  cities: [],
  isLoading: true,
  rejected: '',
  currentCity: {}
}

function reducer(state, action) {
  switch (action.type) {
    case 'isLoading':
      return { ...state, isLoading: true }
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(city => city.id !== action.payload)
      }
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload
      }
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload }

    case 'city/created':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
        cities: [...state.cities, action.payload]
      }
    case 'rejected':
      return {
        ...state, isLoading: false,
        rejected: action.payload
      }
    default:
      throw new Error('NOT LISTED')
  }
}
const CitiesContext = createContext();

function CitiesProvider({ children }) {

  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialState);

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({
        type: 'isLoading'
      })
      try {
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // console.log(data);
        dispatch({ type: 'cities/loaded', payload: data })
        // setCities(data);
      } catch {
        dispatch({
          type: 'rejected',
          action: "There was an error loading data..."
        })
        // alert("There was an error loading data...");
      }
      // finally {
      // setIsLoading(false);
      // }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    dispatch({ type: 'isLoading' })
    try {
      // setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      // console.log(data);
      dispatch({ type: 'city/loaded', payload: data })
      // setCurrentCity(data);
    } catch {
      dispatch({
        type: 'rejected',
        action: "There was an error loading city..."
      })
      // alert("There was an error loading data...");
    }
    // finally {
    //   setIsLoading(false);
    // }
  }

  async function createCity(newCity) {
    dispatch({ type: 'isLoading' })
    try {
      // setIsLoading(true);

      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-type": "application/json",
        },
      });

      const data = await res.json();
      dispatch({ type: 'city/created', payload: data })
      // console.log(data);
      // setCities((c) => [...c, data]);
    }
    catch {
      dispatch({ type: 'rejected', payload: "There was an error Creating City..." })
      // alert("There was an error Creating City...");
    }
    // finally {
    //   setIsLoading(false);
    // }
  }

  async function deleteCity(id) {
    dispatch({ type: 'isLoading' })
    try {
      // setIsLoading(true);

      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({
        type: 'city/deleted',
        payload: id
      })
      // setCities((c) => c.filter((c) => c.id !== id));
    } catch {
      dispatch({ type: 'rejected', payload: "There was an error Deleting City..." })
      // alert("There was an error Deleting City...");
    }
    // finally {
    // setIsLoading(false);
    // }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside ot it's provider");
  return context;
}

export { CitiesProvider, useCities };
