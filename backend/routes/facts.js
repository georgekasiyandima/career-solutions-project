const express = require('express');
const router = express.Router();

const FACTS = [
  {
    id: 1,
    heading: "Did you know? The largest cruise ship in the world, Icon of the Seas, can hold over 7,600 passengers and features a 140,000-gallon water park!",
    text: "This massive ship, operated by Royal Caribbean, redefines luxury with its six waterslides, seven pools, and an AquaTheater, setting a new standard for cruise vacations.",
    image: "/images/Icon of the Seas.jpg",
    category: "modern",
  },
  {
    id: 2,
    heading: "Early cruise ships, like the Cunard's Britannia of 1840, even carried live cows for fresh milk.",
    text: "You can get milk by the carton or by the glass on every modern-day cruise ship. And, you could get fresh milk in 1840, too, when Cunard's first ship, Britannia, set sail across the Atlantic. The kicker? That milk came from live cows kept onboard.",
    image: "/images/Britannia of 1840.jpeg",
    category: "historical",
  },
  {
    id: 3,
    heading: "Carnival Makes 60,000 Chocolate Covered Strawberries on Just One Day",
    text: "For Valentine's Day aboard Carnival Cruise Line's fleet of Fun Ships, chefs whip up over 60,000 chocolate covered strawberries fleetwide just on February 14 each year. That's in addition to all of the sweet treats and desserts the line rolls out each and every day.",
    image: "/images/Carnival.jpg",
    category: "food",
  },
  {
    id: 4,
    heading: "Party Like It's 1999: Internet Debuts Aboard Cruise Ships",
    text: "The launch of Norwegian Cruise Line's Norwegian Sky in 1999 heralded another first: internet at sea. The ship's Internet Café was a big deal back then – so much so that it was situated along the Galleria Promenade, front and center, for all passengers to see.",
    image: "/images/Norwegian.jpg",
    category: "technology",
  },
  {
    id: 5,
    heading: "Disney Magic's Anchor Weighs as Much as Three Elephants",
    text: "Disney Cruise Line notes each anchor aboard their first ship, Disney Magic, weighs an astonishing 28,200 pounds – roughly the equivalent of three fully-grown elephants. What's more, the length of an average anchor chain aboard a cruise ship is roughly 1,000 feet, with each individual link weighing up to 130 pounds apiece. That's a lot of weight!",
    image: "/images/Disney.jpg",
    category: "engineering",
  },
  {
    id: 6,
    heading: "The First Non-Smoking Cruise Ship Debuted…25 Years Ago",
    text: "Carnival Cruise Lines was truly ahead of its time when it debuted the world's first non-smoking cruise ship back in 1998. Carnival Paradise was adorned with a gigantic no-smoking symbol emblazoned on its side (in person, you can still see it etched into the steel, beneath the bridge wings, if you look closely). The non-smoking status of Carnival Paradise wasn't just PR fluff, either: contractors who built the ship in Finland were prohibited from smoking while working on the construction and outfitting of the hull, and the fines for passengers who broke the rules were punishing: a $250 fine and removal from the ship at the next port of call.",
    image: "/images/Carnival2.jpg",
    category: "health",
  },
  {
    id: 7,
    heading: "Nearly 30 Cruise Ships Were Scrapped During the COVID-19 Pandemic",
    text: "From the 1996-built Costa Victoria to the venerable ex-ocean liner Marco Polo, nearly 30 major cruise ships were scrapped as a result of the halt in travel due to the 2020 COVID-19 pandemic. In all, Cruise Critic tracked 29 ships that went to the scrapyard between 2020 and 2023 – and several ships are still in limbo as this article was written.",
    image: "/images/Covid19.jpg",
    category: "pandemic",
  },
];

// GET /api/facts
router.get('/', (req, res) => {
  res.status(200).json(FACTS);
});

module.exports = router; 