

const axios = require('axios')

exports.handler = async (event) => {
    let limit = 10
    if (event.arguments.limit) {
        limit = event.arguments.limit
    }
    const url = `https://api.coinlore.net/api/tickers/?limit=${limit}`
    let response = await axios.get(url)
    return JSON.stringify(response.data.data);
};
