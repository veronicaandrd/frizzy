/* =====================================================================
   3) LINE BANK. Add/edit freely. Placeholders: {city} {t} {rh} {wind}
   Keep lines short. Every RULES id needs an entry here.
   ===================================================================== */
const LINES={
 storm:[
  "Wind AND rain? Your hairstyle never stood a chance. Dignity optional.",
  "{wind} km/h wind plus rain. Your hair is losing this battle. Gracefully.",
  "Sideways rain in {city}. Your hair has been given a very difficult assignment."],
 gale:[
  "Wind's out here modeling harder than you. Secure the strands. All of them.",
  "{wind} km/h gusts. Loose hair today is a hostage situation. Tie it down.",
  "Severe wind in {city}. Hold onto your hair and whatever's left of your composure."],
 windrain:[
  "Wind and rain have teamed up. Your hair never stood a chance.",
  "Damp AND tangly? Tie it up. Future you will say thanks.",
  "Rain's wetting it, wind's rearranging it. Compromise accordingly."],
 rainheavy:[
  "It's absolutely pouring. Your hairstyle is losing this battle.",
  "Downpour in {city}. Hair goals: survive, not shine.",
  "Total soak. At this point, your hairstyle deserves a moment of silence."],
 rain:[
  "Rain's here. Your hair will have some thoughts about that.",
  "Wet day. Whatever you did to your hair this morning was brave.",
  "A proper rainy day. Your hairstyle has been put on notice."],
 wind:[
  "Windy. That's a tangle trap. Secure the strands or own the chaos.",
  "{wind} km/h wind is styling you uninvited.",
  "Strong wind. Your hairstyle is about to become a team effort."],
 heat:[
  "Hot AF. Your hair has officially requested a day off.",
  "{t}°C and your hair is filing a complaint.",
  "It's {t}°C in {city}. Your hair is not built for this nonsense."],
 hothumid:[
  "{t}°C and {rh}% humidity: sweat, frizz and volume, all at once.",
  "Hot soup air. Your hair's about to go full poodle.",
  "Hot AF with {rh}% humidity. Your hair is about to be loud about it"],
 foggydamp:[
  "Thick damp air in {city}. Hair will bloom. Embrace the halo.",
  "The air feels like a damp towel no one asked for. Deep condition now and blame the fog later.",
  "Walking through a cloud. Frizz is staging a quiet takeover."],
 damp:[
  "Cold but damp. No sweat, still frizz. The moisture found you anyway.",
  "{rh}% humidity at {t}°C. Shape might wander and drying takes forever.",
  "Damp air in {city}. Your hairstyle may develop its own interpretation.",
  "Not hot, just damp. Your hair is still taking notes."],
 fog:[
  "Foggy. The air is basically moisture with a view.",
  "Foggy enough to make your hair slightly more unpredictable.",
  "Damp-air alert. Not a crisis, just a little extra puff."],
 soup:[
  "The atmosphere is soup. Your hair has been added to the recipe.",
  "{rh}% humidity. Hair has absorbed the whole sky. Embrace the cloud.",
  "Maximum moisture. Straightening today is an act of optimism.",
  "Sea-level swamp in {city}. Your hairstyle has questions."],
 veryhumid:[
  "Frizz forecast: strong. The air has entered its villain era.",
  "{rh}% humidity. Your hair has opinions and they're getting louder.",
  "Humid AF. Your hair will be responding accordingly.",
  "Puff alert in {city}. Bun it or own the fluff."],
 static:[
  "Static's lurking. Moisturize or get ready to shock strangers.",
  "Cold, dry, crackly. Your hair is collecting electricity for no reason.",
  "{rh}% humidity: balloon-rubbing science project hair."],
 dry:[
  "Air's drier than a stale croissant. Condition like you mean it.",
  "{rh}% humidity: dry-hair weather. Your ends know what's up.",
  "Crispy-ends forecast for {city}. The atmosphere is not helping.",],
 humid:[
  "Humid out there. Expect volume you didn't order.",
  "{rh}% humidity. Your hair is picking up the whole atmosphere of {city}.",
  "Humidity is getting a little too comfortable. Your hair may object."],
 lightrain:[
  "A little rain. Your hair won't melt, but it may have opinions.",
  "Light drizzle. Mildly annoying, mostly fine.",
  "Damp sky in {city}. Your hairstyle may take it personally.",
  "Just enough rain to make your hair reconsider everything."],
 breeze:[
  "Windy enough to tangle. Keep your expectations flexible.",
  "A {wind} km/h breeze is doing a free blowout. Not always flattering.",
  "Breezy. Loose hair gets a plot twist.",
  "Just a breeze. Your hair can handle it. Probably."],
 mild:[
  "Not perfect, not terrible. Hair may do its own thing a bit.",
  "Mildly moody air in {city}. Hair says: fine, whatever.",
  "Nothing wild in the air. Your hair gets to be normal today."],
 utopia:[
  "Minimal humidity, zero chaos, light breeze. A rare hair utopia. Go wild. Enjoy.",
  "Hair utopia. Whatever you did this morning, don't touch it.",
  "{t}° and calm. Your hair is having a suspiciously good day.",
  "This is suspiciously good hair weather. Show it off.",
  "Perfect hair weather in {city}. Don't waste it on a hat."],
 good:[
  "Good hair weather. Low chaos, easy styling.",
  "Zero drama in the forecast. Your hair is cooperating.",
  "{t}°C and calm. Hair behaves. Enjoy it.",
  "The weather is being unusually considerate of your hair.",
  "{city} is giving easy-hair energy today."],
 ok:[
  "Nothing dramatic. Your hair is just vibing.",
  "No hair notes today. Carry on.",
  "Nothing to report. Your hair gets a day off from the weather.",
  "Neutral weather in {city}. Hair does its usual thing."]
};

/* Add-on for warm/humid states when fog is present (fog as a secondary note) */
const FOG_NOTES=["Fog's not helping.","Plus fog, because why not.","The mist adds extra puff."];
