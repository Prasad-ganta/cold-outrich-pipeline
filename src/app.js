const inquirerImport = require("inquirer");
const inquirer = inquirerImport.default ?? inquirerImport;
const prompt =
  typeof inquirer.prompt === "function"
    ? inquirer.prompt.bind(inquirer)
    : inquirer.createPromptModule
    ? inquirer.createPromptModule()
    : null;

const oceanService = require("./services/ocean.service");

console.log("Ocean Service:", oceanService);

const {
  findLookalikeCompanies
} = oceanService;

const {
  searchDecisionMakers,
  enrichEmails
} = require("./services/prospeo.service");

const {
  sendEmail
} = require("./services/brevo.service");

async function main() {
  try {
    const seedDomain = process.argv[2];

    if (!seedDomain) {
      console.log("Usage: npm start company.com");
      process.exit(1);
    }

    console.log("Finding lookalike companies...");

    const domains =
      await findLookalikeCompanies(seedDomain);

    console.log(`Found ${domains.length} companies`);

    console.log("Finding decision makers...");

    const people =
      await searchDecisionMakers(domains);

    console.log(`Found ${people.length} people`);

    console.log("Enriching emails...");

    const contacts =
      await enrichEmails(people);

    console.log("\nSummary\n");

    contacts.forEach((contact, i) => {
      console.log(
        `${i + 1}. ${contact.person.name}`
      );

      console.log(contact.person.email);

      console.log("------------");
    });

    if (!prompt) {
      throw new Error("Unable to initialize inquirer prompt module.");
    }

    const answer = await prompt([
      {
        type: "confirm",
        name: "send",
        message: "Send emails?"
      }
    ]);

    if (!answer.send) {
      console.log("Cancelled.");
      return;
    }

    for (const contact of contacts) {
      try {
        await sendEmail(contact);

        console.log(
          `Sent to ${contact.person.email}`
        );
      } catch (err) {
        console.log(
          `Failed: ${contact.person.email}`
        );

        console.log(err.message);
      }
    }

    console.log("Completed.");
  } catch (error) {
    console.error(
      "Application Error:"
    );

    console.error(error.response?.data || error);
  }
}

main(); const inquirerImport = require("inquirer");
const inquirer = inquirerImport.default ?? inquirerImport;
const prompt =
  typeof inquirer.prompt === "function"
    ? inquirer.prompt.bind(inquirer)
    : inquirer.createPromptModule
    ? inquirer.createPromptModule()
    : null;

const oceanService = require("./services/ocean.service");

console.log("Ocean Service:", oceanService);

const {
  findLookalikeCompanies
} = oceanService;

const {
  searchDecisionMakers,
  enrichEmails
} = require("./services/prospeo.service");

const {
  sendEmail
} = require("./services/brevo.service");

async function main() {
  try {
    const seedDomain = process.argv[2];

    if (!seedDomain) {
      console.log("Usage: npm start company.com");
      process.exit(1);
    }

    console.log("Finding lookalike companies...");

    const domains =
      await findLookalikeCompanies(seedDomain);

    console.log(`Found ${domains.length} companies`);

    console.log("Finding decision makers...");

    const people =
      await searchDecisionMakers(domains);

    console.log(`Found ${people.length} people`);

    console.log("Enriching emails...");

    const contacts =
      await enrichEmails(people);

    console.log("\nSummary\n");

    contacts.forEach((contact, i) => {
      console.log(
        `${i + 1}. ${contact.person.name}`
      );

      console.log(contact.person.email);

      console.log("------------");
    });

    if (!prompt) {
      throw new Error("Unable to initialize inquirer prompt module.");
    }

    const answer = await prompt([
      {
        type: "confirm",
        name: "send",
        message: "Send emails?"
      }
    ]);

    if (!answer.send) {
      console.log("Cancelled.");
      return;
    }

    for (const contact of contacts) {
      try {
        await sendEmail(contact);

        console.log(
          `Sent to ${contact.person.email}`
        );
      } catch (err) {
        console.log(
          `Failed: ${contact.person.email}`
        );

        console.log(err.message);
      }
    }

    console.log("Completed.");
  } catch (error) {
    console.error(
      "Application Error:"
    );

    console.error(error.response?.data || error);
  }
}

main(); 
