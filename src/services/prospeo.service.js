const axios = require("axios");
const { prospeoApiKey } = require("../config/env");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestWithRetries(fn, retries = 12) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const responseData = error.response?.data;
      const status = error.response?.status;
      const errorCode = responseData?.error_code || status || error.code || error.message;
      const isRateLimit =
        status === 429 ||
        responseData?.error_code === "Rate limit exceeded" ||
        responseData?.error_code === "RATE_LIMIT_EXCEEDED";

      if (!isRateLimit || attempt === retries) {
        throw error;
      }

      const retryAfter = Number(error.response?.headers?.["retry-after"]);
      const baseDelay = 2000 * 2 ** (attempt - 1);
      const jitter = Math.floor(Math.random() * 1000);
      const wait = Number.isFinite(retryAfter)
        ? retryAfter * 1000
        : Math.min(60000, baseDelay + jitter);

      console.warn(
        `Prospeo rate limit hit (${errorCode}), retrying in ${wait}ms (${attempt}/${retries})`
      );
      await delay(wait);
    }
  }

  throw lastError;
}

async function searchDecisionMakers(domains) {
  const response = await requestWithRetries(() =>
    axios.post(
      "https://api.prospeo.io/search-person",
      {
        page: 1,
        filters: {
          company: {
            websites: {
              include: domains
            }
          }
        }
      },
      {
        headers: {
          "X-KEY": prospeoApiKey,
          "Content-Type": "application/json"
        }
      }
    )
  );

  return response.data.results;
}

async function enrichEmails(results) {
  if (!prospeoApiKey) {
    throw new Error(
      "Missing PROSPEO_API_KEY environment variable. Please set it in .env."
    );
  }

  const payload = results.map((item, index) => ({
    identifier: String(index),
    person_id: item.person.id
  }));

  const batchSize = 1;
  const batches = [];

  for (let i = 0; i < payload.length; i += batchSize) {
    batches.push(payload.slice(i, i + batchSize));
  }

  const matchedContacts = [];

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batchPayload = batches[batchIndex];

    console.log(
      `Enriching emails batch ${batchIndex + 1}/${batches.length}...`
    );

    try {
      const response = await requestWithRetries(() =>
        axios.post(
          "https://api.prospeo.io/bulk-enrich-person",
          {
            only_verified_email: true,
            data: batchPayload
          },
          {
            headers: {
              "X-KEY": prospeoApiKey,
              "Content-Type": "application/json"
            }
          }
        )
      );

      matchedContacts.push(...response.data.matched);
    } catch (error) {
      const errorCode = error.response?.data?.error_code || error.code || error.message;
      console.warn(
        `Batch ${batchIndex + 1} failed after retries: ${errorCode}`
      );
    }

    await delay(2000);
  }

  return matchedContacts;
}

module.exports = {
  searchDecisionMakers,
  enrichEmails
};
