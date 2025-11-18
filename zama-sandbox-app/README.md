# zama-tech-test-202511-sandbox-console
Zama technical challenge. A tiny "sandbox console" for a fictional gateway used by developers for API keys.

## Run steps
 1. Check out the repository
 1. Run `npm install`. This was developed using node version 24.11.0 and npm 11.6.1
 1. To build: `npm run build`. To server: `npm run start`
 1. To test units (Jest): `npm run test`
 1. To test e2e (Playwright): `npx playwright test`

## Data
There is no data generator with this project.

The data loaded from the simulated backend is read directly from `demo-data/keys.json`, and the anayltics for each key from `demo-data/analytics.json`.

## Design decisions
I looked at the current landscape for creating React apps and decided to use Next.js mostly based on the requirement to deploy the project on Vercel and because I wanted to see how the framework had progressed since I last used it.

I had originally planned to make an offline-first app which hydrated data from a backend in the background. To this end I was using Next.js's routing to behave as an API. I included Mock Service Workers (msw) to allow me to use the whole app offline for demo purposes. Whilst this worked very well for unit tests, I did run into some issues with versions of Next and React around the `useFormAction` hook and it started to feel like I was fighting against the framework.

I restarted the project in order to do it how Next.js seems to prefer it done: with pages, actions and contexts. This was quite the learning curve and different from previous versions. I did have to make my own work-around to avoid the problematic `useFormAction` hook (it doesn't trigger a render on the most recent state update), but I learnt a lot and had fun solving the problems which came my way.

I have used reducer functions a few times for state management as they are easy to test and have the benefit of allowing for easy manipulation of the state from outside the component, providing that the state is accessible from without, too.

I used Material UI's React components mostly for their familiarity, although I themed them similar to Zama's theme and had to use the `sx` prop to change things around. I could have used MUI's tooling better to avoind this prop, but I wanted to press on.

I chose MUI's X-Grid to display the table of keys for its apparent ease to get a feature-rich table up and running quickly. I did still have to read through docs to get it to do things which aren't default features, like rendering extra JSX in cells whilst still sorting on string data. MUI's X-Charts was chosen for similar reasons.

## Time
There were many factors which prevented me from spending large blocks of focused time on this project. One-time but prolongued interruptions.

I did run timers in my IDE and, had the effort been concentrated into workdays, this project would have taken 4 days.

I know this is unusually long for me and I attribute a sizable chunk of that time to wrangling the framework. Such setup events are infrequent in the day-to-day of a front-end developer so I believe this should not be used against me.

## Final thoughts
Although I lost a lot of time throughout the project fighting with the framework. I'm glad I chose it, though, as it was an interesting exercise and has brought be up to date with the latest version.

If I had more time, I would have liked to add more tests as I usually like to write tests for major or reusable modules covering edge cases and documenting "normal" usage.

I would add "Are you sure" checks to revoking keys, and add the option to remove keys with the same check. In the vein of editing keys, the option to change the human-readable name would be desirable.

I had hoped to use parallel routes to do things such as:
 * show the key creation form in a modal in addition to exposing a route
 * show analytics charts below the table of keys when a key is selected, rather than load a whole new page

I would also like to add the revoke option to the table so users don't have to click through to the key's page, as I think this would be easier to find. Checkbox options to select several keys to revoke at once could be useful for power users, too.
