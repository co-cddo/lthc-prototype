//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter


// Custom filter: get a greeting based on the time of day
addFilter("greeting", function () {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
});


// Custom filter: formats content by wrapping it in <p> tags
addFilter("formatContent", function (content) {
  if (Array.isArray(content)) {
    return content.map(para => `<p class="govuk-body">${para}</p>`).join("\n");
  }
  if (!/<[a-z][\s\S]*>/i.test(content)) {
    return `<p class="govuk-body">${content}</p>`;
  }
  return content;
});


// Custom filter: merges two arrays by concatenating them
addFilter("merge", function (array1, array2) {
  return array1.concat(array2);
});


// Custom filter: formats a date to a friendly long date string
addFilter("friendlyDateLong", function (value) {
  const date = new Date(value);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
});


// Custom filter: checks if a URL starts with "https://"
addFilter("startsWithHttps", function (value) {
  return value && value.startsWith("https://");
});
