const axios = require("axios");
const { oceanApiKey } = require("../config/env");

async function findLookalikeCompanies(seedDomain) {
  if (!oceanApiKey) {
    throw new Error(
      "Missing OCEAN_API_KEY environment variable. Please set it in .env."
    );
  }

  const response = await axios.post(
    "https://api.ocean.io/v3/search/people",
    {
      size: 100,
      companiesFilters: {
        lookalikeDomains: [seedDomain]
      }
    },
    {
      headers: {
        "x-api-token": oceanApiKey,
        Authorization: `Bearer ${oceanApiKey}`,
        "Content-Type": "application/json"
      }
    }
  );

  const domains = [
    ...new Set(
      response.data.people
        .map((p) => p.domain)
        .filter(Boolean)
    )
  ];

  return domains;
}

module.exports = {
  findLookalikeCompanies
};