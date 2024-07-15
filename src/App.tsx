import { useEffect, useState } from "react";
import "./App.css";
import { crystalsMap } from "./data";

function App() {
  const [data, setData] = useState<any[]>([]);
  const [fetched, setFetched] = useState<boolean>(false);
  const getCrystalSales = async () => {
    const request = await fetch(
      "https://universalis.app/api/v2/history/Cerberus/8,9,10,11,12,13?minSalePrice=0&maxSalePrice=2147483647"
    );
    const data = await request.json();
    return data.items;
  };

  const getListingsAverage = (data: any) => {
    const averages = [];
    for (const [key, value] of Object.entries(data)) {
      //@ts-ignore
      console.log(value.entries[0].pricePerUnit);
      const object = {
        name: crystalsMap.get(key).en,
        average: Math.round(
          //@ts-ignore
          value.entries.reduce((acc, obj) => acc + obj.pricePerUnit, 0) /
            //@ts-ignore
            value.entries.length
        ),
      };
      averages.push(object);
    }
    return averages;
  };

  const sortAverages = (averages: any) => {
    //@ts-ignore
    return averages.sort((a, b) => a.average - b.average).reverse();
  };

  useEffect(() => {
    getCrystalSales()
      .then((value) => getListingsAverage(value))
      .then((value) => sortAverages(value))
      .then((value) => setData(value))
      .then(() => setFetched(true))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <h1>Top crystals on Cerberus</h1>
      {fetched && (
        <div>
          {data.map((item) => (
            <div className="">
              <h2>{item.name}</h2>
              <h3>{item.average} gil per unit</h3>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
