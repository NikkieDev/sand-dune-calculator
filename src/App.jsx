import { useEffect, useState, useRef } from "react";

function redirect(to) {
  fetch('http://localhost/api/url', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: to })
  }).then(r => r.json())
  .then(r => location.href = r.to)
  .catch(e => console.error(e));
}

function FooterBtn(props) {
  return <>
    <button className="px-4 py-2 flex flex-grow" onClick={() => redirect(props.children.toLowerCase())} style={{color: props.text, background: props.color}}>{props.children}</button>
  </>
}

export default function App() {
  const [steamPrice, setSteamPrice] = useState();
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("euro");
  const [currencySign, setCurrencySign] = useState("€");
  const [price, setPrice] = useState("");
  const [first, setFirst] = useState(true);
  const item = "P250 | Sand Dune";
  const itemHash = "P250 | Sand Dune (Field-Tested)";

  function changeCurrency(newCurrency) {
    const x = document.getElementById("loading");
    let currencyID;
    
    setCurrency(newCurrency);
    if (newCurrency == "euro") (currencyID = 3, setCurrencySign("€"));
    else if (newCurrency == "dollar") (currencyID = 1, setCurrencySign("$"));

    fetch("/api/p250", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency: currencyID,
        item: itemHash
      }),
    }).then(r => r.json())
    .then(r => {
      setSteamPrice(r.lowest_price);
      x.innerHTML = `Price: ${r.lowest_price}`;
    })
    .catch(e => {
      alert("Couldn't fetch current price");
      x.innerHTML = "An error has occured.";
    });
  }

  onload = () => {
    changeCurrency("euro");
  }

  useEffect(() => {
    const dollar = document.getElementById("dollar");
    const euro = document.getElementById("euro");

    if (currency == "euro") {
      euro.classList = "active";
      dollar.classList = "";
    } else if (currency == "dollar") {
      dollar.classList = "active";
      euro.classList = "";
    }
  }, [currency]);
  
  let newSteam = steamPrice;
  useEffect(() => {
    if (first == true)  {
      setFirst(false);
    } else {
      newSteam = (currency == "euro") ? newSteam.replace('€', '').replace(',', '.') : newSteam.replace('$', '');
      setPrice(Math.round(((amount * Number(newSteam)) + Number.EPSILON) * 100) / 100);
    }
  }, [amount]);

  return (
    <>
      <div className="bg-gray-800 flex flex-col text-white items-center justify-center h-screen w-screen">
        <div className="w-2/4">
          <div className="flex justify-center items-center flex-col gap-2">
              <h1 className="text-4xl">{item} Calculator</h1>
              <span className="text-xs flex flex-row gap-1 items-center justify-center">
                <p>A React App by</p>
                <a href="https://nikkie-schaad.nl" className="px-2 py-0.5 bg-gray-600 rounded-xl">me</a>
              </span>
            </div>
            <div className="flex flex-row bg-gray-50 font-semibold text-sm mt-5">
                <img src="/p250.png" style={{width: "248px"}}></img>
                <div className="flex flex-col gap-8 px-2 py-1 text-white bg-gray-900 ml-auto w-full">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-md">Amount of {item}s</h3>
                    <input type="number" className="px-2 py-1 rounded text-black" placeholder="amount" id="amount" onChange={() => {setAmount(document.getElementById("amount").value)}} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-row gap-1">
                          <h3 className="text-md">Price in </h3>
                          <div className="flex flex-row gap-1">
                            <button onClick={() => changeCurrency("euro")} className="active" id="euro">€ euro</button>
                            <i className="cursor-default">/</i>
                            <button onClick={() => changeCurrency("dollar")} id="dollar">$ dollar</button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h3 id="loading">Loading..</h3>
                        <p>Total price: {price}{currencySign}</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="flex flex-row w-full">
              <FooterBtn color="#8A2BE2">Github</FooterBtn>
              <FooterBtn color="red">Source</FooterBtn>
              <FooterBtn color="orange">Website</FooterBtn>
            </div>
        </div>
      </div>
    </>
  )
}