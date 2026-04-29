const fetchButton = document.querySelector('#fetch-alerts');
const stateInput  = document.querySelector('#state-input');
const alertsDiv   = document.querySelector('#alerts-display');
const errorDiv    = document.querySelector('#error-message');

fetchButton.addEventListener('click', async () => {
  const state = stateInput.value.trim().toUpperCase();

  // Clear input immediately on click
  stateInput.value = '';

  // Clear previous content
  errorDiv.classList.add('hidden');
  errorDiv.textContent = '';
  alertsDiv.textContent = '';

  // Guard against empty input
  if (!state) {
    errorDiv.textContent = 'Please enter a state abbreviation.';
    errorDiv.classList.remove('hidden');
    return;
  }

  try {
    const response = await fetch(`https://api.weather.gov/alerts/active?area=${state}`);

    if (!response.ok) {
      throw new Error('Unable to fetch alerts. Check the state abbreviation.');
    }

    const data    = await response.json();
    const alerts  = data.features;

    // Format the test expects: "Current watches, warnings... for New York: 7"
    alertsDiv.textContent = `${data.title}: ${alerts.length}`;

    alerts.forEach(alert => {
      const p = document.createElement('p');
      p.textContent = alert.properties.headline;
      alertsDiv.appendChild(p);
    });

  } catch (err) {
    errorDiv.textContent = err.message || 'Network failure';
    errorDiv.classList.remove('hidden');
  }
});