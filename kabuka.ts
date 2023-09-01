import axios from "axios";

const getStockPrice = async () => {
  const apiKey = "P3QQ19KFPZWQTJ8Z";  // Alpha VantageのAPIキーに置き換えてください
  const symbol = "AAPL";  // 株価を取得したい会社を入力
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const timeSeries = response.data["Time Series (1min)"];
    const timestamps = Object.keys(timeSeries);
    const latesttimestamps = timestamps.slice(0, 2);
    
    latesttimestamps.forEach(timestamp => {
      console.log(`Time: ${timestamp}`);
      console.log(`Open: ${timeSeries[timestamp]['1. open']}`);
      console.log(`High: ${timeSeries[timestamp]['2. high']}`);
      console.log(`Low: ${timeSeries[timestamp]['3. low']}`);
      console.log(`Close: ${timeSeries[timestamp]['4. close']}`);
      console.log('---');
    });
  } catch (error) {
    console.error(error);
  }
};

getStockPrice();