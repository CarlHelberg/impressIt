(function () {
  const appletId = 'mood-applet';
  const dbEndpoint = 'https://your-database-endpoint.com/feedback'; // Replace with your database endpoint
  const currentUrl = window.location.href;
  const iconsPath = './icons/'; // Adjust this path based on where the icons folder is relative to the script

  // Check if the applet already exists on the page
  if (document.getElementById(appletId)) return;

  // Create the applet container
  const applet = document.createElement('div');
  applet.id = appletId;
  applet.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 150px;
    height: 60px;
    background: #f3f3f3;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Arial, sans-serif;
    cursor: pointer;
    padding: 5px;
  `;

  // Helper function to create an icon element
  function createIcon({ src, alt, customStyle, onClick }) {
    const iconElement = document.createElement('img');
    iconElement.src = `${iconsPath}${src}`;
    iconElement.alt = alt;
    iconElement.style.cssText = `
      margin: 2px;
      cursor: pointer;
      ${customStyle || ''}
    `;
    iconElement.addEventListener('click', onClick);
    return iconElement;
  }

  // Happy Icon
  const happyIcon = createIcon({
    src: 'happy.png',
    alt: 'happy',
    customStyle: 'width: 24px; height: 24px; position: relative; border-radius: 50%;',
    onClick: () => handleIconClick('happy'),
  });

  // Neutral Icon
  const neutralIcon = createIcon({
    src: 'neutral.png',
    alt: 'neutral',
    customStyle: 'width: 24px; height: 24px; position: relative; border-radius: 50%;',
    onClick: () => handleIconClick('neutral'),
  });

  // Unhappy Icon
  const unhappyIcon = createIcon({
    src: 'unhappy.png',
    alt: 'unhappy',
customStyle: 'width: 24px; height: 24px; position: relative; border-radius: 50%;',
    onClick: () => handleIconClick('unhappy'),
  });

  // Append icons to the applet
  applet.appendChild(happyIcon);
  applet.appendChild(neutralIcon);
  applet.appendChild(unhappyIcon);

  const expandButton = document.createElement('span');
  expandButton.textContent = '✍️';
  expandButton.style.cssText = `
    font-size: 10px;
    margin-left: 5px;
    margin-right: -30px;
    position: relative;
    top: -10px;
    cursor: pointer;
  `;

  const textArea = document.createElement('textarea');
  textArea.style.cssText = `
    display: none;
    position: absolute;
    bottom: 70px;
    right: 20px;
    width: 200px;
    height: 100px;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 5px;
    z-index: 1000;
  `;

  expandButton.addEventListener('click', () => {
    textArea.style.display = textArea.style.display === 'none' ? 'block' : 'none';
  });

  applet.appendChild(expandButton);
  document.body.appendChild(applet);
  document.body.appendChild(textArea);

  // Tooltip
  const infoIcon = document.createElement('span');
  infoIcon.textContent = 'ℹ️';
  infoIcon.style.cssText = `
    font-size: 10px;
    margin-left: 5px;
    position: relative;
    top: -25px;
    cursor: pointer;
  `;

  const infoToolTip = document.createElement('div');
  infoToolTip.textContent =
    'Please select how you feel about the current page you\'re on. The only data collected is the emoji and the page address.';
  infoToolTip.style.cssText = `
    display: none;
    position: absolute;
    bottom: 90px;
    right: 20px;
    width: 200px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    font-size: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  `;

  const messageToolTip = document.createElement('div');
  messageToolTip.textContent =
    'Tell us exactly what you think by sending an optional message.';
  messageToolTip.style.cssText = `
    display: none;
    position: absolute;
    bottom: 90px;
    right: 20px;
    width: 200px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    font-size: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  `;

  infoIcon.addEventListener('mouseenter', () => {
    infoToolTip.style.display = 'block';
  });

  infoIcon.addEventListener('mouseleave', () => {
    infoToolTip.style.display = 'none';
  });

  expandButton.addEventListener('mouseenter', () => {
    messageToolTip.style.display = 'block';
  });

  expandButton.addEventListener('mouseleave', () => {
    messageToolTip.style.display = 'none';
  });

  applet.appendChild(infoIcon);
  document.body.appendChild(infoToolTip)
  document.body.appendChild(messageToolTip);

  // Handle icon click
  function handleIconClick(feeling) {
    currentFeeling = feeling;
    sendFeedback();
    highlightIcon(feeling);
  }

  // Highlight the selected icon
  function highlightIcon(selectedFeeling) {
    [happyIcon, neutralIcon, unhappyIcon].forEach((icon) => {
      icon.style.cssText = icon.alt === selectedFeeling ?
      `box-shadow: 0 4px 6px -3px rgba(0, 0, 0, 0.9);
       border-radius: 50%;
       width: 24px; height: 24px; position: relative;
       opacity: 1;`
      :
      `opacity: 0.5;
       border-radius: 50%;
       width: 24px; height: 24px; position: relative;`
    });
  }

  // Send feedback to the database
  function sendFeedback() {
    const message = textArea.value;
    const payload = {
      feeling: currentFeeling,
      message,
      url: currentUrl,
    };

    fetch(dbEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(() => {
      alert('Feedback submitted!');
    });
  }

  // Load the last selected icon
  (function loadLastFeedback() {
    fetch(`${dbEndpoint}?url=${encodeURIComponent(currentUrl)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.feeling) {
          currentFeeling = data.feeling;
          highlightIcon(data.feeling);
        }
      });
  })();
})();
