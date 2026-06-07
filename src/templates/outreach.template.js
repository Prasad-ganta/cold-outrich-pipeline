module.exports = (person) => {
  return `
    <h3>Hi ${person.name},</h3>

    <p>
      I noticed your work at ${person.company}.
    </p>

    <p>
      We help companies automate outreach,
      lead generation and customer engagement.
    </p>

    <p>
      Would love to explore whether this can create value for your team.
    </p>

    <p>
      Regards,<br/>
      Prasad
    </p>
  `;
};