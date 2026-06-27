# Koda Assessment

Built with Next.js, Supabase, TanStack Query, and Tailwind CSS.

## Technology Choices

| Technology          | Purpose                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Next.js 16**      | React.js is one of the frameworks that I am most familiar with–I used Next.js for the file based routing and the capability to create API routes |
| **Supabase**        | For PostgreSQL database, and authentication. I chose this for quick set up and familiarity                                                       |
| **TanStack Query**  | For fetching, caching, mutations, and for optimistic updates                                                                                     |
| **React Hook Form** | Form handling and validation                                                                                                                     |
| **Tailwind CSS 4**  |                                                                                                                                                  |
| **TypeScript**      | Type safety                                                                                                                                      |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd koda-assessment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the project root with the following (please do note that I won't normally share secrets like this, it's just for convenience :D):

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://vliletxubzfreucttsro.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_O2kArjRHIhgWjGkVBx-caA_Mpm9fpiT
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technical Reflection

### Why did you choose this implementation approach?

I chose this tech stack because I'm most familiar with it, I've worked on something similar to this since my last year in college (which is about more than a year ago). I chose Supabase for the backend because it's fast to set up, and is especially useful for projects like this one.

I decided to use TanStack query for fetching, caching, mutations, and also for optimistic updates. It also helps simplify handling states for loading, error, etc.

For data fetching/mutation the pattern I did was component -> custom hook (that utilizes TanStack) -> API route. I learned this approach in my last job, as someone with only a little experience I'm not sure if this is the best approach (as I haven't been exposed to different companies' approaches yet) but the reasoning behind why it's done I think makes sense.

Single Responsibility - each layer handles their own job. The component only handles the rendering, it doesn't care about any cache key, logic, API url, etc. The hook handles the cache and request logic, etc. The API route talks to Supabase.

Reusability

Cleanliness, and predictability of how the flow of logic goes

### What tradeoffs did you make?

One tradeoff to the approach I took is the complexity of it I guess? Instead of writing just one file to handle a certain function, there's three things to write, an API route, a hook for it, and utilizing that hook in a component.

### What would you improve if given additional time?

I would improve on the UI. The UI looks okay but it looks generic as it's been mostly AI generated, some parts less so than others because I utilized code from a personal project of mine for certain things.

I would also improve on the functionality, as currently it's very bare–it doesn't have sorting, search. I don't have experience doing this yet, but a feature I can think of that can make this project's UX better is a drag and drop system similar to something like GitHub projects–so the projects will be separated by columns, and when you want to change the progress of a project, an option on how to do it would be dragging.

### Did you use AI tools during development?

Yes.

**Which tools?**

Claude Code

**How were they used?**

I used it to speed up the development.

I first created documents that the AI can reference when it's generating code. Those documents contain informaiton of how I want the project to be made (folder structure, which files go to which directory, patterns, etc.). This is done so that when I check and read the code that's been generated, there's less chance of it to be something I don't want.

The UI is AI generated, loosely based on another project I have (like the auth screens).

AI also performs better when there's already a pattern/reference set. So what I do is I write the the routes, hooks, etc. Then those can be used as reference also if I need to create more using AI.
