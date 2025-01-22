import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function emojiToCountryCode(emoji) {
  const codePoints = [...emoji].map((char) => char.codePointAt(0) - 127397);
  return String.fromCharCode(...codePoints);
}

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message
        message={"Adding your first city by clicking on the city on the map"}
      />
    );

  // const countries = [...new Set(cities.map((city) => city.country))];
  const countries = [
    ...new Map(
      cities.map((city) => [
        city.country,
        { country: city.country, emoji: city.emoji },
      ])
    ).values(),
  ];
  // console.log(countries);

  // const xs = cities.reduce((arr, city) => {
  //   if (
  //     !arr
  //       .map((el) => {
  //         console.log(el);
  //         el.country;
  //         return el.country;
  //       })
  //       .includes(city.country)
  //   )
  //     return [...arr, { country: city.country, emoji: city.emoji }];
  //   else return arr;
  // }, []);

  // console.log(countries);
  return (
    <ul className={styles.countryList}>
      {countries.map((country, index) => (
        <CountryItem country={country} key={index} />
      ))}
    </ul>
  );
}

export default CountryList;
