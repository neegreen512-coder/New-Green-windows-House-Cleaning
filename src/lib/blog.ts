/* ============================================================================
   NEW GREEN — BLOG
   Ten ready-to-publish cleaning-tips articles. These are the built-in fallback,
   so the blog is never empty. The owner can add, edit, and remove posts from
   /admin (stored in the CMS); anything there takes over from this list.
   Body format: paragraphs separated by a blank line. A line starting with
   "## " renders as a subheading.
   ========================================================================== */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  readMin: number;
  cover: string;
  date: string; // display date
  body: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "streak-free-windows-the-real-secret",
    title: "The real secret to streak-free windows",
    excerpt:
      "Most streaks are not a cleaning-product problem. They are a technique and timing problem. Here is how the pros get glass to disappear.",
    tag: "Window cleaning",
    readMin: 4,
    cover: "/images/window-clean.webp",
    date: "2026-08-12",
    body: `Everyone has scrubbed a window until their arm ached, stepped back, and watched the sun reveal a haze of streaks. It is one of the most common frustrations in home cleaning, and the fix is rarely a fancier spray.

## It usually is not the product
Streaks come from residue, not from a lack of effort. Too much cleaner leaves a film. A cotton rag sheds lint and pushes dirt around. And cleaning in direct sun dries the glass before you can finish, baking in every smear. Change those three things and most streaks disappear on their own.

## The method that works
Start by dusting the frame and sill so you are not dragging grit across the glass. Use a light mist of cleaner, or just warm water with a drop of dish soap, and a flat-weave microfibre cloth or a quality squeegee. Work top to bottom in overlapping strokes, and wipe the squeegee blade after each pass. Finish the edges with a dry microfibre cloth.

## Timing matters more than you think
Clean windows on an overcast day or in the early morning or evening, when the glass is cool and in shade. The cleaner stays wet long enough for you to actually remove it rather than watching it flash-dry.

If your windows still look cloudy after all that, the culprit is usually hard-water mineral deposits etched into the glass, which need a different approach. That is exactly the kind of build-up a professional clean is built to handle, and it is why exterior glass around Mississauga and the GTA often needs a proper reset once or twice a year.`,
  },
  {
    slug: "how-often-should-you-clean-your-windows",
    title: "How often should you actually clean your windows?",
    excerpt:
      "Twice a year is the honest answer for most GTA homes, but where you live and what surrounds your house can change that. Here is how to tell.",
    tag: "Window cleaning",
    readMin: 3,
    cover: "/images/windows-room.jpg",
    date: "2026-07-28",
    body: `There is no single right answer, but there is a sensible baseline. For most homes across Mississauga and the GTA, a proper interior and exterior window clean twice a year, once in spring and once in fall, keeps glass clear and protects it from long-term damage.

## What pushes it more often
A few things speed up how quickly windows get dirty. Homes near busy roads collect road film and exhaust. Properties surrounded by trees deal with pollen, sap, and bird activity. New construction nearby means fine dust for months. And south or west-facing glass shows every mark because it catches the most light.

## Why it is not just about looks
Left alone, mineral deposits, sap, and pollution slowly etch into glass. Screens trap moisture against the frame, and tracks collect grit that wears out seals. Regular cleaning is genuinely a small maintenance habit that extends the life of the windows themselves.

## A simple rule of thumb
Spring and fall for the whole house. Add a light mid-summer touch-up for the windows you look through every day, like the kitchen and living room. If you cannot remember the last time the outsides were done, it is time.`,
  },
  {
    slug: "the-15-minute-daily-reset",
    title: "The 15-minute daily reset that keeps your home guest-ready",
    excerpt:
      "You do not need to deep clean every day. You need a short, repeatable reset that stops mess from piling up. Here is the routine.",
    tag: "House cleaning",
    readMin: 4,
    cover: "/images/interior.jpg",
    date: "2026-07-10",
    body: `A tidy home is not the result of one heroic cleaning day. It is the result of small, consistent resets that keep clutter from building into an overwhelming pile. Fifteen focused minutes a day does more than a frantic three-hour session every couple of weeks.

## Work by zone, not by task
Instead of cleaning "the whole house," pick the three zones that get the most use: the kitchen counter, the entryway, and the main living space. These are the areas that make a home feel messy or calm within seconds of walking in.

## The routine
Set a timer for fifteen minutes. Clear and wipe the kitchen counters. Reset the entryway, so shoes, keys, and bags go where they belong. Do a quick lap of the living room, returning stray items to their homes and fluffing the cushions. If there is time left, wipe the bathroom sink.

## Why it works
Because nothing ever gets far ahead of you. A home that is reset daily never needs an emergency clean, and the weekly or professional clean can focus on the deeper work like floors, bathrooms, and detail areas rather than digging out from under clutter.

Keep it light and keep it consistent. The goal is not perfection every day. It is a home that is always fifteen minutes from ready.`,
  },
  {
    slug: "spring-cleaning-checklist-gta-homes",
    title: "A room-by-room spring cleaning checklist for GTA homes",
    excerpt:
      "After a long Ontario winter, spring is the moment to reset the whole house. Use this checklist so nothing gets missed.",
    tag: "Seasonal",
    readMin: 5,
    cover: "/images/house-clean.webp",
    date: "2026-06-22",
    body: `Winter leaves its mark on a home. Salt tracks in on boots, windows close up for months, and dust settles in the corners we stop noticing. Spring cleaning is the reset that clears all of it at once. Here is a room-by-room checklist to work through.

## Whole home
Start high and work low. Dust ceiling fixtures, corners, and the tops of doors and frames. Wipe down light switches and door handles. Vacuum and wash floors last, once the dust from everything above has settled.

## Kitchen
Clear and wipe inside the fridge, degrease the range and backsplash, and wipe cupboard fronts. Pull out small appliances and clean underneath. Run an empty cycle with a cleaner through the dishwasher.

## Bathrooms
Descale the showerhead and taps, scrub grout, and wash the exhaust fan cover. Wipe the inside of the medicine cabinet and toss anything expired.

## Living areas and bedrooms
Wash or air out soft furnishings, vacuum under cushions, rotate the mattress, and launder bedding including the duvet and pillows if the care label allows.

## Windows and light
This is the one that transforms a home. Clean the interior and exterior glass, wipe frames and sills, and clear the tracks. After a winter of closed windows, the extra daylight makes the whole house feel new.

If working through all of that at once feels like a lot, this is exactly what a one-time deep clean is for. It handles the heavy reset in a single visit so you can enjoy the results rather than the labour.`,
  },
  {
    slug: "eco-friendly-cleaning-safe-for-kids-and-pets",
    title: "Eco-friendly cleaning: what is actually safe for kids and pets",
    excerpt:
      "Green cleaning is not just marketing. Here is what to look for, what to avoid, and a few simple swaps that genuinely work.",
    tag: "Healthy home",
    readMin: 4,
    cover: "/images/spray.jpg",
    date: "2026-06-05",
    body: `When there are small children crawling on the floor or pets licking their paws, what you clean with matters as much as how clean the surface looks. The good news is that safer products have caught up, and you rarely have to trade effectiveness for peace of mind.

## What to avoid
Be cautious with anything that leaves strong fumes, especially products containing ammonia or chlorine bleach, and be careful never to mix them. Watch out for vague "fragrance" on labels, which can hide irritants, and skip antibacterial everything, which is rarely necessary for everyday surfaces.

## What actually works
For most day-to-day cleaning, a plant-based all-purpose cleaner, warm water, and a good microfibre cloth handle the job. Diluted white vinegar cuts through grease and mineral film, and a little baking soda tackles scrubbing without scratching. These simple options are gentle on kids, pets, and your surfaces.

## Where to be thorough
Safe does not mean careless. High-touch spots like handles, switches, and taps still deserve regular attention, and floors that pets walk on benefit from a proper mop rather than a quick spray. The aim is a home that is genuinely clean and genuinely safe at the same time.

At New Green we default to eco-friendly products chosen to suit your home, and we are always happy to adjust if anyone in the house has sensitivities. A clean home should never come at the cost of a healthy one.`,
  },
  {
    slug: "move-out-cleaning-get-your-deposit-back",
    title: "Move-out cleaning: how to leave a place spotless",
    excerpt:
      "Moving is stressful enough. A proper move-out clean protects your deposit and leaves the next person a home they can settle into.",
    tag: "House cleaning",
    readMin: 4,
    cover: "/images/kitchen-clean.webp",
    date: "2026-05-18",
    body: `A move-out clean is different from a regular clean. The home is empty, every surface is on show, and someone is going to inspect it closely. The payoff is real: a thorough clean is often the difference between getting your full deposit back and losing a chunk of it.

## Clean in the right order
Do it after the furniture is out, not before. An empty room reveals scuffs, dust lines, and marks that were hidden for months. Work top to bottom and leave the floors for last.

## The spots that get checked
Inspectors and new tenants look in the same places: inside the oven and fridge, the bathroom grout and around the toilet, window tracks and sills, inside cupboards and drawers, and behind where appliances stood. Baseboards, light switches, and door frames matter too.

## Do not forget the details
Wipe down blinds, clean the range hood filter, and check the tops of doors and the corners of ceilings for cobwebs. Replace burnt-out bulbs and empty every drawer.

## When to hand it over
Move-out cleaning is genuinely a lot of work at the worst possible time, when you are exhausted from packing. A professional move-out or deep clean takes the whole reset off your plate and gives you a result that stands up to inspection. It is one less thing to worry about on an already long day.`,
  },
  {
    slug: "hard-water-spots-on-glass",
    title: "Hard water spots on glass: why they happen and how to remove them",
    excerpt:
      "Those cloudy spots that will not wipe away are mineral deposits. Here is what causes them and how to bring glass back to clear.",
    tag: "Window cleaning",
    readMin: 3,
    cover: "/images/interior.jpg",
    date: "2026-04-30",
    body: `You clean the glass, it dries, and there they are again: chalky white spots that no amount of regular cleaner seems to touch. Those are hard-water deposits, and they need a different approach than everyday grime.

## What they are
When water sits on glass and evaporates, it leaves behind the minerals it was carrying, mostly calcium and magnesium. Sprinklers, rain running off a roof, and shower spray are the usual sources. Over time the deposits bond to the surface and can even begin to etch it.

## How to remove them
For fresh spots, a solution of equal parts white vinegar and warm water, left to sit for a few minutes and then wiped with microfibre, often lifts them. For stubborn build-up, a dedicated mineral or lime remover is more effective. Always test a small area first, and never use anything abrasive on glass.

## Why it is worth acting early
Left long enough, hard-water etching becomes permanent and no cleaner will fix it. Regular exterior window cleaning removes the deposits before they can bond, which is one of the quiet reasons routine cleaning protects the glass and not just the view. If your windows are already past the point where vinegar helps, a professional clean with the right products is the safest way to bring them back.`,
  },
  {
    slug: "how-to-prepare-your-home-for-a-cleaning-visit",
    title: "How to prepare your home for a cleaning visit",
    excerpt:
      "A few minutes of prep helps your cleaner spend their time on cleaning, not tidying. Here is how to get the most from every visit.",
    tag: "House cleaning",
    readMin: 3,
    cover: "/images/dusting.webp",
    date: "2026-04-14",
    body: `You do not need to clean before the cleaner arrives. But a little light prep helps the team spend their time on the deep work that makes the biggest difference, rather than moving your belongings around.

## A quick pick-up goes a long way
Clear surfaces of everyday clutter like mail, toys, and dishes. It means the cleaner can wipe every counter fully rather than working around piles, and nothing personal gets moved or misplaced.

## Point out what matters to you
Every home has its priorities. Maybe it is the kitchen, maybe it is the bathrooms, maybe it is the windows in the room you work in. A quick note about what matters most helps the team focus their time where you will notice it.

## Make access easy
Secure pets in a comfortable spot, and let the team know about anything delicate or off-limits. If you will not be home, confirm how they get in and where to leave keys. We are happy to work around whatever arrangement suits you.

## Then leave it to us
Once the prep is done, the best thing you can do is get on with your day. Come back to a home that is genuinely reset, and let us handle the parts you would rather not.`,
  },
  {
    slug: "deep-clean-or-regular-clean",
    title: "Deep clean or regular clean: which does your home need?",
    excerpt:
      "They are not the same service. Knowing the difference helps you book the right one and get exactly the result you are after.",
    tag: "House cleaning",
    readMin: 4,
    cover: "/images/cinematic.webp",
    date: "2026-03-26",
    body: `People often ask why cleaning prices vary so much, and the answer usually comes down to this: a deep clean and a regular clean are two different jobs. Booking the right one saves you money and gets you the result you actually want.

## A regular clean maintains
A regular clean keeps an already-cared-for home fresh. Surfaces wiped, floors vacuumed and mopped, bathrooms and kitchen refreshed, and everything tidied. It is the steady visit, weekly, bi-weekly, or monthly, that keeps a home consistently comfortable.

## A deep clean resets
A deep clean reaches everything routine cleaning skips: build-up on the range and in the oven, scale and grout in the bathroom, baseboards and edges, interior window glass, and the spots behind and under things. It takes longer because it is doing more.

## Which one to book
If you keep on top of your home and just want to hand off the upkeep, a regular clean is right. If it has been a while, you are moving in or out, hosting, or starting a recurring plan, begin with a deep clean. Many people book a deep clean first to bring the home to a great baseline, then keep it there with regular visits.

Not sure which yours needs? Tell us about your home when you request a quote and we will recommend the right starting point, with a clear price before anything is booked.`,
  },
  {
    slug: "winter-window-care-in-ontario",
    title: "Winter window care in Ontario: condensation, salt, and grime",
    excerpt:
      "Ontario winters are hard on windows. Here is how to protect your glass and frames through the cold months.",
    tag: "Seasonal",
    readMin: 4,
    cover: "/images/hero-clean.webp",
    date: "2026-02-08",
    body: `Between road salt, freeze-thaw cycles, and months of closed windows, an Ontario winter is tough on glass. A little care through the season keeps your windows clear and prevents problems that are harder to fix in spring.

## Manage condensation
Condensation on the inside of windows is common in winter, when warm indoor air meets cold glass. Left alone, that moisture pools on the sill and can lead to mould and wood damage. Wipe it down when you see it, run a fan or crack a window briefly when cooking or showering, and keep furniture from blocking airflow to the glass.

## Deal with salt and film
Road salt and winter grime build a hazy film on exterior glass, especially on windows facing the street. You cannot always fix it fully in the cold, but clearing the worst of it, and keeping tracks free of grit and ice-melt residue, protects the seals and hardware.

## Do not force frozen tracks
If a window is frozen shut, never force it. You risk cracking the seal or the glass. Let it thaw and keep the tracks clear so meltwater can drain rather than refreeze.

## The spring reset
Winter grime is stubborn, and the safest, most thorough time to remove it is a proper clean once the cold breaks. Booking an early-spring window clean lifts a whole season of salt and film at once, and gets your home ready for the brighter months.`,
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
