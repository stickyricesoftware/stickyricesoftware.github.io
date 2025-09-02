import { useEffect, useState } from "react";
import { BASE_URL, testMode, } from "./config";





export default function useBootstrap() {
  const [bootstrap, setBootstrap] = useState(null);
  const [currentGw, setCurrentGw] = useState(null);
  const [nextGw, setNextGw] = useState(null);

  useEffect(() => {
    async function getBootstrap() {
      try {
        let data;
        if (testMode) {
          data = bootstrapTest;
          console.log("TEST MODE - Bootstrap Data", data);
        } else {
          const res = await fetch(BASE_URL + "bootstrap-static/");
          data = await res.json();
          console.log("API CALL MADE - Bootstrap Data", data);
        }

        // Set current and next game week
        let current = null;
        let next = null;
        data.events.forEach((event) => {
          if (event.is_current) current = event.id;
          if (event.is_next) next = event.id;
        });

        // Sort players by transfers_in
        data.elements.sort((a, b) => b.transfers_in - a.transfers_in);

        setBootstrap(data);
        setCurrentGw(current);
        setNextGw(next);
      } catch (error) {
        console.error("Something went wrong... ", error);
      }
    }

    getBootstrap();
  }, []);

  return { bootstrap, currentGw, nextGw };
}
