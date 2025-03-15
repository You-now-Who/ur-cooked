let headers = new Headers({
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-GB,en;q=0.5",
  Connection: "keep-alive",
  Host: "www.swiggy.com",
  "If-None-Match": 'W/"20f6d-QU2PyKWXcOKNxHR/8c1OovoPdFk"',
  Priority: "u=0, i",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "cross-site",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
});

async function selectRandomRestaurant() {
  console.log("Selecting random restaurant");
  navigator.geolocation.getCurrentPosition(async (position) => {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;

    let restaurantUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;

    res = await fetch(restaurantUrl, {
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        let restaurants =
          data.data.cards[1].card.card.gridElements.infoWithStyle.restaurants;
        // pick a random restaurant
        let randomRestaurant =
          restaurants[Math.floor(Math.random() * restaurants.length)];
        setTimeout(() => {
          window.location.href = randomRestaurant.cta.link;
        }, 5000);

        return randomRestaurant.cta.link;

        return data;
      });
  });
}

async function addRandomRestaurantItemsToCart() {
  // Get all the items in the restaurant using all document.querySelectorAll with class 'add-button-center-container'
  // console.log("Im still standing")
  let items = document.querySelectorAll(".add-button-center-container");
  let randomCount = Math.floor(Math.random() * 10) + 4; // Random number between 3 and 6
  let selectedItems = [];

  while (selectedItems.length < randomCount && items.length > 0) {
    let randomIndex = Math.floor(Math.random() * items.length);
    selectedItems.push(items[randomIndex]);
    items = Array.from(items).filter((_, index) => index !== randomIndex);
  }

  for (let item of selectedItems) {
    item.click();
    // Check if the customize button appears and click it if it does
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let continueButton = document.querySelector(
      '[data-testid="menu-customize-continue-button"]'
    );
    if (continueButton) {
      continueButton.click();
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let customizeButton = document.querySelector(
      '[data-cy="customize-footer-add-button"]'
    );
    // console.log(customizeButton);
    if (customizeButton) {
      customizeButton.click();
    }
  }
}
