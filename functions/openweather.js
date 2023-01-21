exports.handler = async () => {
  try {
    const apiKey = {
      statusCode: 200,
      body: JSON.stringify(process.env.OPEN_WEATHER_KEY),
    };
    return apiKey;
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
