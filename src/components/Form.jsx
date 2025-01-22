import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";

import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useURLPosition } from "../hooks/useURLPosition";
import { useCities } from "../contexts/CitiesContext";
import Message from "./Message";
import Spinner from "./Spinner";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
const FLAG_URL = "https://flagcdn.com/w320/";
function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [lat, lng] = useURLPosition();

  const { createCity, isLoading } = useCities();

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");

  useEffect(
    function () {
      if (!lat && !lng) return;
      async function fetchCityDate() {
        try {
          setIsLoadingGeocoding(true);
          setGeoCodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That does not seem to be a city, CLick somewhere else 😞"
            );
          setCityName(data.cityName || data.locality || "");
          setCountry(data.countryName);
          setEmoji(data.countryCode.toLowerCase());
        } catch (err) {
          setGeoCodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      fetchCityDate();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji: `${FLAG_URL}${emoji.toLowerCase()}.png`,
      date,
      notes,
      position: { lat, lng },
    };
    // console.log(newCity);
    await createCity(newCity);
    navigate("/app/cities");
    // console.log(e);
  }

  if (isLoadingGeocoding) return <Spinner />;

  if (!lat && !lng)
    return <Message message="Start by CLicking somewhere in the map" />;

  if (geoCodingError) return <Message message={geoCodingError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          <img src={`${FLAG_URL}${emoji}.png`} alt="" />
          {/* {emoji} */}
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
        {/* <button>Add</button> */}
        {/* <button>&larr; Back</button> */}
      </div>
    </form>
  );
}

export default Form;
